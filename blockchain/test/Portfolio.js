
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Portfolio", function () {
  async function deployPortfolio() {
    const [owner, otherUser] = await ethers.getSigners();

    const Portfolio = await ethers.getContractFactory("Portfolio");
    const portfolio = await Portfolio.deploy();

    return { portfolio, owner, otherUser };
  }

  describe("Adding holdings", function () {
    it("Should add a holding successfully", async function () {
      const { portfolio, owner } = await deployPortfolio();

      await portfolio.addHolding("Bitcoin", "BTC", 2, 50000, 55000);

      const holdings = await portfolio.getMyHoldings();

      expect(holdings.length).to.equal(1);
      expect(holdings[0].name).to.equal("Bitcoin");
      expect(holdings[0].symbol).to.equal("BTC");
      expect(holdings[0].quantity).to.equal(2);
      expect(holdings[0].owner).to.equal(owner.address);
    });

    it("Should reject an empty name", async function () {
      const { portfolio } = await deployPortfolio();

      await expect(
        portfolio.addHolding("", "BTC", 2, 50000, 55000)
      ).to.be.revertedWith("Valid name required");
    });

    it("Should reject a zero quantity", async function () {
      const { portfolio } = await deployPortfolio();

      await expect(
        portfolio.addHolding("Bitcoin", "BTC", 0, 50000, 55000)
      ).to.be.revertedWith("Quantity must be positive");
    });
  });

  describe("User holdings", function () {
    it("Should keep each user's holdings separate", async function () {
      const { portfolio, otherUser } = await deployPortfolio();

      await portfolio.addHolding("Bitcoin", "BTC", 2, 50000, 55000);
      await portfolio.connect(otherUser).addHolding(
        "Ethereum", "ETH", 1, 3000, 3500
      );

      expect(await portfolio.getMyHoldingCount()).to.equal(1);
      expect(
        await portfolio.connect(otherUser).getMyHoldingCount()
      ).to.equal(1);

      expect((await portfolio.connect(otherUser).getMyHoldings())[0].name)
        .to.equal("Ethereum");
    });
  });

  describe("Removing holdings", function () {
    it("Should remove a holding", async function () {
      const { portfolio } = await deployPortfolio();

      await portfolio.addHolding("Bitcoin", "BTC", 2, 50000, 55000);
      await portfolio.removeHolding(0);

      expect(await portfolio.getMyHoldingCount()).to.equal(0);
    });

    it("Should reject removing a nonexistent holding", async function () {
      const { portfolio } = await deployPortfolio();

      await expect(
        portfolio.removeHolding(999)
      ).to.be.revertedWith("Holding not found");
    });
  });
});
