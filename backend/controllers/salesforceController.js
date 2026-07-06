const jsforce = require("jsforce");
const createOAuth = require("../config/oauth");

const {
  setConnection,
  getConnection,
} = require("../services/salesforceService");

/*
=========================================
Login with Salesforce
=========================================
*/

exports.login = (req, res) => {
  const oauth2 = createOAuth();

  const url = oauth2.getAuthorizationUrl({
    scope: "api refresh_token id",
  });

  res.redirect(url);
};

/*
=========================================
OAuth Callback
=========================================
*/

exports.callback = async (req, res) => {
  try {
    const oauth2 = createOAuth();

    const connection = new jsforce.Connection({
      oauth2,
    });

    await connection.authorize(req.query.code);

    setConnection(connection);

    console.log("================================");
    console.log("Salesforce Login Successful");
    console.log("User:", connection.userInfo.id);
    console.log("Org :", connection.userInfo.organizationId);
    console.log("================================");

    res.redirect("http://salesforce-validation-manager-bxs8.onrender.com/frontend/index.html");
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/*
=========================================
Check Login
=========================================
*/

exports.status = (req, res) => {
  const conn = getConnection();

  res.json({
    success: true,
    loggedIn: conn !== null,
  });
};

/*
=========================================
Get Validation Rules
=========================================
*/

exports.getValidationRules = async (req, res) => {
  try {
    const conn = getConnection();

    if (!conn) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const result = await conn.tooling.query(`
      SELECT Id,
             ValidationName,
             Active,
             EntityDefinition.QualifiedApiName
      FROM ValidationRule
      ORDER BY ValidationName
    `);

    res.json({
      success: true,
      records: result.records,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/*
=========================================
Toggle Validation Rule
=========================================
*/

exports.toggleValidationRule = async (req, res) => {
  try {
    const conn = getConnection();

    if (!conn) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const { id, active } = req.body;

    await conn.tooling.sobject("ValidationRule").update({
      Id: id,
      Active: active,
    });

    res.json({
      success: true,
      message: "Validation Rule Updated Successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
