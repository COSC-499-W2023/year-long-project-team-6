<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="input">
    <form action="image.php" method="post" enctype="multipart/form-data">
        <div id="main">
            <div class="EnterText">
                <legend>Enter title</legend>
                
            <input type="text" id="title" placeholder="Enter Text Here" name="title" >
            </div>
            <div class="EnterText">
            <legend>Enter content</legend>
                <input type="text" id="text" placeholder="Enter Text Here" name="text" >
    </div>

    <div class="EnterText">
            <div id="choose">
            <legend>Choose your image</legend>
                <input type="file" name="image" id="image" accept="image/jpeg, image/png, image/jpg">
    </div>
            </div>

            <div id="button">
                <button type="submit" value="Upload Image" name="submit" id="post">Post</button>
            </div>

        </div>
    </form>
    </div>
</body>
</html>