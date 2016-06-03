function getPictureError(error){
	showMessage("Error getting picture -> " + error.code);
}

function downloadError(error) {
    showMessage("Download Error \n Code: " + error.code + " - Source: " + error.source);
}

function uploadError(error) {
    showMessage("Upload Error \n Code: " + error.code);
}

function readEntriesError(error){
	showMessage("ReadEntriesError\nFailed to list directory contents. Error code is: " + error.code);
}

function createWriterError (error){
	showMessage("Error occurred while creating writer to new file. Error code is: " + error.code);
}

function getFileError(error){
	showMessage("Error occurred while getting pointer to new file. Error code is: " + error.code);
}

function removeFileError(error){
	showMessage("Error occurred while removing a file. Error code is: " + error.code);
}

function getDirectoryError(error){
    showMessage("Error occurred while getting pointer to directory. Error code is: " + error.code);
}

function removeDirectoryError(error){
    showMessage("Error occurred while removing directory. Error code is: " + error.code);
}

function requestFileSystemError(error){
	showMessage("Error reading/writing image file. Error code is: " + error.code +'\n'+error.source+'\n'+error.target);
}

function sendImageToServerError(error){
	showMessage("Erro: o upload do arquivo não foi possível. Código: " + error.code);
	showMessage("upload error source " + error.source);
	showMessage("upload error target " + error.target);
}

function showMessage(msg){
	if(verbose)
	alert(msg)
}
