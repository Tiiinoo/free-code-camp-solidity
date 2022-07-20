// SPDX-License-Identifier: MIT
pragma solidity >=0.5.11 <0.9.0; //

contract SimpleStorage {
    uint256 favouriteNumber;
    struct People {
        uint256 favouriteNumber;
        string name;
    }

    mapping(string => uint256) public nameGotYouNumber;

    People[] public people;

    function addSomeGuys(uint256 _favoriteNumber, string memory _name) public {
        people.push(People(_favoriteNumber, _name));
        nameGotYouNumber[_name] = _favoriteNumber;
    }

    function store(uint256 _favouriteNumber) public {
        favouriteNumber = _favouriteNumber;
    }

    function retrieve() public view returns (uint256) {
        return favouriteNumber;
    }
}
