const { connectionString, targetDevice } = process.env;
const client = require('azure-iothub').Client.fromConnectionString(connectionString);
function createMessage(key) {
    return {
        methodName: "remoteControl",
        payload: { key }
    }
}
exports.remoteControl = (status) => new Promise((res, rej) => {
    client.invokeDeviceMethod(targetDevice, createMessage(status), function (err, result) {
        if (err) {
            rej(err);
            return;
         }
         res(result);
    });
});