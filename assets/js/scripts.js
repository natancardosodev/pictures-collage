import $ from 'jquery';

$(() => {
    let uploadedImage = null;

    // Carregue a imagem predefinida
    const predefinedImage = new Image();
    const urlParams = new URLSearchParams(window.location.search);
    const eventName = urlParams.get('evento');
    predefinedImage.src = `./assets/images/${eventName}.png`;
    $('#fluxo-colagem').attr('src', `assets/images/${eventName}-colagem.jpg`);
    $('#nameEvent').html(`#${eventName}`);

    $('#btnCreditos').on('click', () => {
        $('#creditosDesc').toggle(300);
    });

    predefinedImage.onload = function () {
        $('#resultImage').html(predefinedImage);
    };

    predefinedImage.onerror = () => {
        $('#wrapper').hide();
        $('#msg-error').show();
    };

    // Manipule o upload da imagem
    $('#uploadImage').on('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const uploadedImageElement = new Image(1080, 1080);
                uploadedImageElement.src = e.target.result;
                uploadedImageElement.alt = "Modelo de Cartaz #EuVou";
                uploadedImage = uploadedImageElement;
                $('#resultImage').html(uploadedImage);
                
                setTimeout(() => {
                    if (uploadedImage) {
                        // Crie um elemento de tela de canvas para mesclar as imagens
                        const canvas = document.createElement('canvas');
                        canvas.width = predefinedImage.width;
                        canvas.height = predefinedImage.height;
                        const ctx = canvas.getContext('2d');

                        // Desenhe a imagem predefinida no canvas
                        ctx.drawImage(uploadedImage, 0, 0, 1080, 1080);
                        ctx.drawImage(predefinedImage, 0, 0);

                        // Exiba a imagem mesclada
                        const mergedImage = new Image(1080, 1080);
                        mergedImage.src = canvas.toDataURL('image/png');
                        mergedImage.alt = 'Cartaz #EuVou Gerado';
                        $('#resultImage').html(mergedImage);

                        // Ative o link de download
                        $('#downloadLink').attr('href', mergedImage.src).show();
                    }
                }, 50);
            };
            reader.readAsDataURL(file);
        }
    });
});
