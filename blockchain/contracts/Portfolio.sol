
 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Portfolio {
    struct Holding {
        uint256 id;
        string name;
        string symbol;
        uint256 quantity;
        uint256 purchasePrice;
        uint256 currentPrice;
        address owner;
        uint256 createdAt;
    }

    uint256 private nextHoldingId;

    mapping(address => Holding[]) private userHoldings;

    event HoldingAdded(
        address indexed owner,
        uint256 indexed id,
        string name,
        string symbol,
        uint256 quantity
    );

    event HoldingRemoved(
        address indexed owner,
        uint256 indexed id,
        string name,
        string symbol,
        uint256 quantity
    );

    // Reject empty strings and strings containing only ASCII whitespace.
    function _hasNonWhitespace(string calldata value)
        private
        pure
        returns (bool)
    {
        bytes calldata data = bytes(value);
        for (uint256 i = 0; i < data.length; i++) {
            bytes1 char = data[i];

            if (
                char != 0x20 && // space
                char != 0x09 && // tab
                char != 0x0A && // newline
                char != 0x0D && // carriage return
                char != 0x0B && // vertical tab
                char != 0x0C    // form feed
            ) {
                return true;
            }
        }

        return false;
    }

    function addHolding(
        string calldata name,
        string calldata symbol,
        uint256 quantity,
        uint256 purchasePrice,
        uint256 currentPrice
    ) external {
        require(_hasNonWhitespace(name), "Valid name required");
        require(_hasNonWhitespace(symbol), "Valid symbol required");
        require(quantity > 0, "Quantity must be positive");
        require(purchasePrice > 0, "Purchase price required");
        require(currentPrice > 0, "Current price required");

        uint256 id = nextHoldingId++;

        userHoldings[msg.sender].push(
            Holding({
                id: id,
                name: name,
                symbol: symbol,
                quantity: quantity,
                purchasePrice: purchasePrice,
                currentPrice: currentPrice,
                owner: msg.sender,
                createdAt: block.timestamp
            })
        );

        emit HoldingAdded(msg.sender, id, name, symbol, quantity);
    }

    function getMyHoldings() external view returns (Holding[] memory) {
        return userHoldings[msg.sender];
    }

    function removeHolding(uint256 id) external {
        Holding[] storage holdings = userHoldings[msg.sender];

        for (uint256 i = 0; i < holdings.length; i++) {
            if (holdings[i].id == id) {
                Holding memory holding = holdings[i];

                emit HoldingRemoved(
                    msg.sender,
                    holding.id,
                    holding.name,
                    holding.symbol,
                    holding.quantity
                );

                // Replace the removed entry with the last entry.
                // The order of holdings may change after removal.
                holdings[i] = holdings[holdings.length - 1];
                holdings.pop();

                return;
            }
        }

        revert("Holding not found");
    }

    function getMyHoldingCount() external view returns (uint256) {
        return userHoldings[msg.sender].length;
    }
}
