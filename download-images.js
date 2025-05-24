const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { createApi } = require('unsplash-js');

//the access key needed to make request from Unsplash's API
const unsplash = createApi({
  accessKey: 'V4JhUxkV1AzxlWt7iM-qg_JMdCBBAL6fUz-lD34F8yA',
});
const imagesDir = path.join(__dirname, 'images');

//the function that allows to access certain images based on key word
//and add it to the images folder
async function downloadUnsplashImage(keyword, filename) {
  try {
    //access the images from Unsplash based on given parameter keywod
    const result = await unsplash.photos.getRandom({ query: keyword });
    if (result.errors) throw new Error(result.errors[0]); //check if there is errors
    
    //get the images
    const photo = result.response;
    const imageUrl = photo.urls.regular;
    
    const response = await axios.get(imageUrl, { 
      responseType: 'stream' 
    });
    
    //if such images is found, save it as given parater filename
    const filepath = path.join(imagesDir, filename);
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => 
    {
      writer.on('finish', () => 
      {
        resolve
        (
          //unsplash require me to list the photographer of the images I used
          //so below is the object that contain the infomation
            {
            localPath: `images/${filename}`,
            photographer: photo.user.name,
            profileLink: `${photo.user.links.html}?utm_source=your_game`
            }
        );
      });
      writer.on('error', reject);
    });
    
  //if there is unexpected error, throw the error images in terminal
  } catch (error){
    console.error(` Error ${keyword}:`, error.message);
  }
}

// Download all your required images
async function downloadAll(){
  const images = [
    //images generated based on given keyword, and save as given file name
    {keyword:'bus',filename:'bus.jpg'},
    {keyword:'cheery',filename:'cheery.jpg'},
    {keyword:'classrooom',filename:'classroom.jpg'},
    {keyword:'Cubey',filename:'Cubey.jpg'},
    {keyword:'darkness',filename:'darkness.jpg'},
    {keyword:'discord',filename:'discord.jpg'},
    {keyword:'doctor',filename:'doctor.jpg'},
    {keyword:'end',filename:'end.jpg'},
    {keyword:'gmail',filename:'gmail.jpg'},
    {keyword:'hallway',filename:'hallway.jpg'},
    {keyword:'Kyubey',filename:'Kyubey.jpg'},
    {keyword:'light',filename:'light.jpg'},
    {keyword:'school',filename:'school.jpg'},
    {keyword:'school2',filename:'school2.jpg'},
    {keyword:'staircase',filename:'staircase.jpg'},
    {keyword:'tree',filename:'tree.jpg'}
  ];

  //get through each img in images then add them to the folder
  for (const img of images)
  {
    await downloadUnsplashImage(img.keyword, img.filename);
  }
}

//run the downloadAll method
downloadAll();