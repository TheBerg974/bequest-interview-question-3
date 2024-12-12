# Tamper Proof Data

At Bequest, we require that important user data is tamper proof. Otherwise, our system can incorrectly distribute assets if our internal server or database is breached. 

**1. How does the client ensure that their data has not been tampered with?**

When a client needs to ensure that their data has not been tampered with during transmission, they can use a combination of Error Correction Codes (ECC) and cryptographic hashes to achieve data integrity (Hashes on both client and server side for files). By combining ECC and cryptographic hashes, the client can confidently verify that the data received is both error-free and untampered, ensuring the integrity of the transmitted data.

<br />
**2. If the data has been tampered with, how can the client recover the lost data?**

 ECC embedded in the data will help detect and correct these errors upon decoding the data (althought there is a point were data can be too corrupt to decode properly). For this project I will be using a reed solomon code implementation. I'll admit the only ECC i know properly is Hamming Codes so I am not too familiar with the math wizardry going on with the library (The library I found on npm is also 10 years old :/). 

For this, I have added a button that corrupts the data in the datastore. My verify data button simply decodes the data back to its original form using ECC. 

### To run the apps:
```npm run start``` in both the frontend and backend

## To make a submission:
1. Clone the repo
2. Make a PR with your changes in your repo
3. Email your github repository to robert@bequest.finance
