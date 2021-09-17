// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GCLOUD_PROJECT environment variable. See
// https://cloud.google.com/docs/authentication/getting-started#setting_the_environment_variable

const fs = require("fs").promises;
// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');
// Creates a client
const client = new vision.ImageAnnotatorClient();

class GoogleVision {

    extractDescription(texts) {
        let document = '';
        texts.forEach(text => {
          document += text.description || '';
        });
        return document.toLowerCase();
      }

    async extractDescriptions(filename, index, response) {
        if (response.textAnnotations.length) {
            const words = await this.extractDescription(response.textAnnotations);

            const regex = /[0-9]{2}\/[0-9]{2}\/[0-9]{4}|[0-9]{4}\/[0-9]{2}\/[0-9]{2}/g
            const regex2 = /نوع المركبة.*\s*:\s*.*/g
            console.log(words);
            console.log(words.match(regex));
            console.log(words.match(regex2));
            // x.match(/نوع المركبة.*\s*:\s*.*/g)

        } else {
            console.log(`${filename} had no discernable text.`);
        }
    }

    async getTextFromFiles(index, inputFiles) {
        // Read all of the given files and provide request objects that will be
        // passed to the Cloud Vision API in a batch request.
        const requests = await Promise.all(
          inputFiles.map(async filename => {
            const content = await fs.readFile(filename);
            console.log(` 👉 ${filename}`);
            return {
              image: {
                content: content.toString('base64'),
              },
              features: [{type: 'TEXT_DETECTION'}],
            };
          })
        );
      
        // Make a call to the Vision API to detect text
        const results = await client.batchAnnotateImages({requests});
        const detections = results[0].responses;
        await Promise.all(
          inputFiles.map(async (filename, i) => {
            const response = detections[i];
            if (response.error) {
              console.info(`API Error for ${filename}`, response.error);
              return;
            }
            await this.extractDescriptions(filename, index, response);
          })
        );
      }

}

module.exports = new GoogleVision;