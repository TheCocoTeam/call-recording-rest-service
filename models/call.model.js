/*
----------------------------------------------------------------------
to_phone_number / from_phone_number

Here's how the E.164 numbering plan works:
A telephone number can have a maximum of 15 digits
The first part of the telephone number is the country code (one to three digits)
The second part is the national destination code (NDC)
The last part is the subscriber number (SN)
The NDC and SN together are collectively called the national (significant) number
----------------------------------------------------------------------
duration

Assuming a phone call can last top a couple of hours.

MySQL SMALLINT
A small integer. The signed range is -32768 to 32767.
The unsigned range is 0 to 65535.
If a column has been set to ZEROFILL, all values will be prepended by zeros so that the SMALLINT value contains a number of M digits.

This type of data will allow to store a little more over 18 hours in seconds.
----------------------------------------------------------------------
time_when_occurred

The internal representation of a timestamp is a string of 7 - 13 bytes.
Each byte consists of 2 packed decimal digits.
The first 4 bytes represent the date, the next 3 bytes the time, and the last 0 - 6 bytes the fractions of a second.
----------------------------------------------------------------------
*/

module.exports = (sequelize, Sequelize) => {
  const Call = sequelize.define('call', {
    to_phone_number: {
      type: Sequelize.STRING(15),
      allowNull: false,
    },
    from_phone_number: {
      type: Sequelize.STRING(15),
      allowNull: false,
    },
    duration: {
      type: Sequelize.SMALLINT,
      allowNull: false,
    },
    time_when_occurred: {
      type: Sequelize.STRING(13),
      allowNull: false,
    },
    is_robocall: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    record_active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: 1,
    },
  });

  return Call;
};
