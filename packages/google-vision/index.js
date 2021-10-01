// // By default, the client will authenticate using the service account file
// // specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// // the project specified by the GCLOUD_PROJECT environment variable. See
// // https://cloud.google.com/docs/authentication/getting-started#setting_the_environment_variable

const vision = require('@google-cloud/vision');

class OcrModel {

  labelDates(extractDescriptionTextArray) {
    // To compare dates I convert the string and check for the max date
    if (extractDescriptionTextArray[0] > extractDescriptionTextArray[1]) {
      return {
        ExpiryDate: extractDescriptionTextArray[0],
        StartDate: extractDescriptionTextArray[1]
      }
    } else {
      return {
        ExpiryDate: extractDescriptionTextArray[1],
        StartDate: extractDescriptionTextArray[0]
      }
    }
  }

  extractDescription(extractedText) {
    // const dateRegex = /[0-9]{2}\/[0-9]{2}\/[0-9]{4}|[0-9]{4}\/[0-9]{2}\/[0-9]{2}/g;
    const dateRegex = /[0-9]{2}\/[0-9]{2}\/[0-9]{4}|[0-9]{4}\/[0-9]{2}\/([0-9]{2}|[0-9]{1})/g;
    // const regex2 = /\nنوع المركبة.*\s*:\s*.*/g
    return this.labelDates(extractedText.match(dateRegex));
  }

  extractTextFromResult(googleVisionPayload) {
    return this.extractDescription(googleVisionPayload[0].fullTextAnnotation.text);
  }

  async getTextFromImage(base64Image) {
    try {
      const client = new vision.ImageAnnotatorClient();
      const results = await client.textDetection({
        image: {
          content: base64Image
        }
      });
      return this.extractTextFromResult(results);
    } catch (error) {
      console.log("Failed to get test from image");
      console.log("Error message", error);
    }
  }
}

module.exports = OcrModel;