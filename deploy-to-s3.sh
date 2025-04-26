#!/bin/bash

# Build the React application
echo "Building React application..."
NODE_OPTIONS=--openssl-legacy-provider npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "Build failed. Exiting."
  exit 1
fi

# Prompt for S3 bucket name
echo "Enter the S3 bucket name (e.g., my-dream-team-app):"
read BUCKET_NAME

# Check if the bucket exists, if not, create it
aws s3 ls s3://$BUCKET_NAME > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "Bucket does not exist. Creating bucket $BUCKET_NAME..."
  aws s3 mb s3://$BUCKET_NAME
  
  # Set bucket for static website hosting
  echo "Configuring bucket for static website hosting..."
  aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html
fi

# Upload the build directory to S3
echo "Uploading files to S3..."
aws s3 sync build/ s3://$BUCKET_NAME --acl public-read

# Set the correct MIME types for JavaScript files
echo "Setting correct MIME types..."
aws s3 cp s3://$BUCKET_NAME/static/js/ s3://$BUCKET_NAME/static/js/ --recursive --content-type "application/javascript" --acl public-read

# Output the website URL
echo "Deployment complete!"
echo "Your website is available at: http://$BUCKET_NAME.s3-website-$(aws configure get region).amazonaws.com"
echo "Or directly via S3 URL: https://$BUCKET_NAME.s3.amazonaws.com/index.html" 