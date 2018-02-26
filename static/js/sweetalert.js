function message_info(tipo){
	if (tipo == 1){	
		swal("Verifica que todo este bien", "Tu usuario no es correcto", "info");
	}else if (tipo == 2){
		swal("Verifica que todo este bien", "No puedes dejar los campos vacios", "warning");
	}else if (tipo == 3){
		swal("Excelente", "Has creado un nuevo usuario", "success");
	}
}
