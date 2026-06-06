// ===============================
// ELEMENT
// ===============================

const fileInput =
document.getElementById("fileInput");

const profileImage =
document.getElementById("profileImage");

const editNameBtn =
document.getElementById("editNameBtn");

const username =
document.getElementById("username");


// ===============================
// LOAD DATA
// ===============================

// LOAD FOTO
const savedImage =
localStorage.getItem("profileImage");

if(savedImage){

  profileImage.src = savedImage;

}

// LOAD USERNAME
const savedUsername =
localStorage.getItem("username");

if(savedUsername){

  username.textContent = savedUsername;

}


// ===============================
// GANTI FOTO PROFILE
// ===============================

fileInput.addEventListener("change", function(){

  const file = this.files[0];

  if(file){

    const reader = new FileReader();

    reader.onload = function(e){

      const imageData = e.target.result;

      // TAMPILKAN FOTO
      profileImage.src = imageData;

      // SIMPAN FOTO
      localStorage.setItem(
        "profileImage",
        imageData
      );

    };

    reader.readAsDataURL(file);

  }

});


// ===============================
// EDIT USERNAME
// ===============================

editNameBtn.addEventListener("click", function(){

  const newUsername = prompt(
    "Masukkan username baru:"
  );

  if(newUsername){

    username.textContent = newUsername;

    // SIMPAN USERNAME
    localStorage.setItem(
      "username",
      newUsername
    );

  }

});
