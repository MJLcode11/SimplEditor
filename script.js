const fileInput = document.querySelector('.file-input');
const filterOptions = document.querySelectorAll('.filter button');
const filterName = document.querySelector('.slider-info .name');
const filterValue = document.querySelector('.slider-info .value');
const filterSlider = document.querySelector('.slider input');
const rotateOptions = document.querySelectorAll('.rotate button');
const previewImg = document.querySelector('.preview-img img');
const fileInputBtn = document.querySelector('.choose-img');
const resetFilterBtn = document.querySelector('.reset-filter');
const saveImgBtn = document.querySelector('.save-img');

let brightness = 100,
  saturation = 100,
  inversion = 0,
  grayscale = 0;
let rotate = 0,
  flipHorizontal = 1,
  flipVertical = 1;

const applyFilters = () => {
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
};

const loadImage = () => {
  let file = fileInput.files[0]; //gets file selected by user
  if (!file) return; // return if no image selected by user
  previewImg.src = URL.createObjectURL(file); //passes file URL as preview img src
  previewImg.addEventListener('load', () => {
    resetFilterBtn.click(); // clicks reset button if user uploads new image
    document.querySelector('.container').classList.remove('disable');
  });
};

filterOptions.forEach((option) => {
  option.addEventListener('click', () => {
    //adds event listener to all filter buttons
    document.querySelector('.filter .active').classList.remove('active');
    option.classList.add('active');
    filterName.innerText = option.innerText;

    if (option.id === 'brightness') {
      filterSlider.max = '200';
      filterSlider.value = brightness;
      filterValue.innerText = `${brightness}%`;
    } else if (option.id === 'saturation') {
      filterSlider.max = '200';
      filterSlider.value = saturation;
      filterValue.innerText = `${saturation}%`;
    } else if (option.id === 'inversion') {
      filterSlider.max = '100';
      filterSlider.value = inversion;
      filterValue.innerText = `${inversion}%`;
    } else {
      filterSlider.max = '100';
      filterSlider.value = grayscale;
      filterValue.innerText = `${grayscale}%`;
    }
  });
});

const updateFilter = () => {
  filterValue.innerText = `${filterSlider.value}%`;
  const selectedFilter = document.querySelector('.filter .active'); //gets selected filter btn

  if (selectedFilter.id === 'brightness') {
    brightness = filterSlider.value;
  } else if (selectedFilter.id === 'saturation') {
    saturation = filterSlider.value;
  } else if (selectedFilter.id === 'inversion') {
    inversion = filterSlider.value;
  } else {
    grayscale = filterSlider.value;
  }
  applyFilters();
};

const resetFilters = () => {
  // resets all variables to default
  brightness = 100;
  saturation = 100;
  inversion = 0;
  grayscale = 0;
  rotate = 0;
  flipHorizontal = 1;
  flipVertical = 1;
  filterOptions[0].click();
  applyFilters();
};

rotateOptions.forEach((option) => {
  option.addEventListener('click', () => {
    if (option.id === 'left') {
      rotate -= 90;
    } else if (option.id === 'right') {
      rotate += 90;
    } else if (option.id === 'horizontal') {
      flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    } else {
      flipVertical = flipVertical === 1 ? -1 : 1;
    }
    applyFilters();
  });
});

const saveImage = () => {
  const canvas = document.createElement('canvas'); //creates canvas element
  const ctx = canvas.getContext('2d'); //returns a drawing context on the canvas
  canvas.width = previewImg.naturalWidth; //sets cnavas width to actual image width
  canvas.height = previewImg.naturalHeight;

  //apply user selected filters to canvas to canvas filter
  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  if (rotate !== 0) {
    // If rotate is not 0, rotate canvas
    ctx.rotate((rotate * Math.PI) / 180);
  }
  ctx.scale(flipHorizontal, flipVertical); // flips canvas horizontally/vertically
  ctx.drawImage(
    previewImg,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );

  const link = document.createElement('a'); //creates <a> element
  link.download = 'image.jpg'; //passes <a> tag downlaod value to "image.jpg"
  link.href = canvas.toDataURL(); //passes <a> tag href value to canvas data url
  link.click(); //clicks <a> tag to download image
};

fileInput.addEventListener('change', loadImage);
filterSlider.addEventListener('input', updateFilter);
resetFilterBtn.addEventListener('click', resetFilters);
saveImgBtn.addEventListener('click', saveImage);
fileInputBtn.addEventListener('click', () => fileInput.click());
