const got = require('got');
const sharp = require('sharp');

Parse.Cloud.beforeSave("dubai_landmarks", async (request, response) => {

    let originalPhoto = (request.original.get('photo') || { url: () => null }).url()
    let targetPhoto = (request.object.get('photo') || { url: () => null }).url()

    if (originalPhoto !== targetPhoto && targetPhoto) {
        const { body, headers } = await got(targetPhoto, { encoding: null })
        const imgBuffer = await sharp(body).resize(250, 250).jpeg().toBuffer()
        const data = Array.from(Buffer.from(imgBuffer, 'binary'))
        const contentType = headers['content-type'];
        let file = new Parse.File('thumb', data, contentType);
        file = await file.save();

        request.object.set('photo_thumb', file)
        response.success();
    }
    response.success();
});
