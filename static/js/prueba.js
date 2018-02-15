function handleFileSelect(evt){
  //objeto FileList
  var files = evt.files = evt.target.files;
  var reader = new FileReader();
  var lista = [];
  
  for(var i = 0, f; f= files[i]; i++){
     if (f) {
       reader.readAsDataURL(f);
    } else {
      preview = "";
    }
  }
    reader.onloadend = function () {
      var preview = '';
      var files = evt.files = evt.target.files;
      var salida = [];
      preview = reader.result;  
        for(var i = 0, f; f= files[i]; i++){
          salida.push('<td>'+
              '<span class="preview"><video src="'+ preview +'" controls=""></video></span>'+
            '</td>'+
            '<td>'+
              '<p class="name">'+ f.name+' </p>'+
            '</td>'+
            '<td>'+
              '<p class="size">'+f.size+'</p>'+
              '<p class="size">'+ f.type || 'n/a'+ '</p> '+
              '<div class="progress progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">'+
                '<div class="progress-bar progress-bar-success" style="width:0%;">'+

                '</div>'+
              '</div>'+
            '</td>'+
              '<td>'+
              '<button class="btn btn-primary start" disabled="">'+
              '<i class="glyphicon glyphicon-upload"></i>'+
              '<span>Start</span></button>'+
              '<button class="btn btn-warning cancel">'+
              '<i class="glyphicon glyphicon-ban-circle"></i>'+
              '<span>Cancel</span>'+
              '</button></td>'+
              '<br><p>bytes last modified: '+ f.lastModifiedDate.toLocaleDateString()+
              '</p>' );
        }
        document.getElementById('list').innerHTML = '<tr class="template-upload fade in">' + salida + '</tr>';

    }
}


document.getElementById('files').addEventListener('change', handleFileSelect, false);





/*
function previewFile() {
  var preview = document.querySelector('video');
  var file    = document.querySelector('input[type=file]').files[0];
  var reader  = new FileReader();
  console.log("hola");
  
  reader.onloadend = function () {
    console.log("2");
    console.log(reader.result);
    preview.src = reader.result;
  }

  if (file) {
    console.log("3");
    console.log(reader.readAsDataURL(file));
    reader.readAsDataURL(file);
  } else {
    preview.src = "";
  }



}
*/