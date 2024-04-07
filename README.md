**Set up step：**

Our application is using aws services with node.js and express.js, using an react framework at frontend, you will need to ensure that you have a available aws account, message davidxuzimin@sina.com with your federated user id (click the top right arrows in your management console) to add trust relationship with your account.

**1. Node.js** 

You will also need node.js installed in your PC, to check if npm is installed, type in your cmd:
```
npm --version
```
If not installed, go to https://nodejs.org/en and download and setup for node.js

**2. AWS services** 

First you need to ensure aws cli is installed in your system, type in your cmd:
```
aws --version
```
In your terminal to check if aws cli is installed.  
How to install aws cli:  
The main documentation is in https://aws.amazon.com/cli/  
Depend on your current operating system, you can download the aws cli in your version in:   
https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html  

We are using aws sso token provider in our application, to configure, you can access the following website for detail:
https://docs.aws.amazon.com/cli/latest/userguide/sso-configure-profile-token.html

Or follow the following step:

Go to the repo directory of the application, type the following command in your terminal:  
```
aws configure sso
```  
Next, fill into the lines base on your own aws account info:  
```
aws configure sso
```
```
SSO session name (Recommended): my-sso 
SSO start URL [None]: https://my-sso-portal.awsapps.com/start SSO region [None]: us-east-1 
SSO registration scopes [None]: sso:account:access
```    
you can type random session name, start URL is the access key from https://ubc-cicsso.awsapps.com/start/#/?tab=accounts , region is ```ca-central-1``` and type ```sso:account:access``` for registration scopes

**3. Start the application:**  
Open two terminals on editer, cd the first terminal to the frontend folder, and use ```npm start``` to start the frontend server:

```
cd ./app/frontend
npm start
```  
Go to the second terminal, cd to the backend folder, use ```npm start``` to start backend server.

```
cd ./app/backend
npm start
```   
If everything goes well, you can now access to our application. If you met any difficulties, please contact davidxuzimin@sina.com for help.
