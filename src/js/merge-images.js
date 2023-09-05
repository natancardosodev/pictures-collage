$(document).ready(function () {
    let uploadedImage = null;

    // Carregue a imagem predefinida
    const predefinedImage = new Image();
    const urlParams = new URLSearchParams(window.location.search);
    const eventName = urlParams.get('evento');
    predefinedImage.src = './imgs/'+eventName+'.png';

    predefinedImage.onload = function () {
        $('#resultImage').html(predefinedImage);
    };

    // Manipule o upload da imagem
    $('#uploadImage').change(function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const uploadedImageElement = new Image();
                uploadedImageElement.src = e.target.result;
                uploadedImage = uploadedImageElement;
                $('#resultImage').html(uploadedImage);
            };
            reader.readAsDataURL(file);
        }
    });

    // Manipule o clique no botão de mesclagem
    $('#mergeImages').click(function () {
        if (uploadedImage) {
            // Crie um elemento de tela de canvas para mesclar as imagens
            const canvas = document.createElement('canvas');
            canvas.width = predefinedImage.width;
            canvas.height = predefinedImage.height;
            const ctx = canvas.getContext('2d');

            // Desenhe a imagem carregada no canvas (você pode ajustar as coordenadas)
            ctx.drawImage(uploadedImage, 0, 0, 1080, 1080);

            // Desenhe a imagem predefinida no canvas
            ctx.drawImage(predefinedImage, 0, 0);


            // Exiba a imagem mesclada
            const mergedImage = new Image();
            mergedImage.src = canvas.toDataURL('image/png');
            $('#resultImage').html(mergedImage);

            // Ative o link de download
            $('#downloadLink').attr('href', mergedImage.src).show();
        }
    });
});
