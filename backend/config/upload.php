<?php
function handleFileUpload() {
    $target_dir = "../../photos/";
    $imageFileType = strtolower(pathinfo($_FILES["itemImage"]["name"], PATHINFO_EXTENSION));
    $new_filename = uniqid() . '.' . $imageFileType;
    $target_file = $target_dir . $new_filename;

    // Check if image file is an actual image
    $check = getimagesize($_FILES["itemImage"]["tmp_name"]);
    if($check === false) {
        throw new Exception("File is not an image.");
    }

    // Check file size (2MB max)
    if ($_FILES["itemImage"]["size"] > 2000000) {
        throw new Exception("Sorry, your file is too large (max 2MB).");
    }

    // Allow certain file formats
    if(!in_array($imageFileType, ["jpg", "png", "jpeg", "gif"])) {
        throw new Exception("Only JPG, JPEG, PNG & GIF files are allowed.");
    }

    if (!move_uploaded_file($_FILES["itemImage"]["tmp_name"], $target_file)) {
        throw new Exception("Sorry, there was an error uploading your file.");
    }

    return $target_file;
}
?>