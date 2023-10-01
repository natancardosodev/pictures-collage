import $ from 'jquery';
import Cropper from 'cropperjs';

$(() => {
    let uploadedImage = null;
    let buttonCortar = $('#btn-cortar');
    let buttonLink = $('#downloadLink');
    let result = $('#resultImage');

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

        if (file.size > 2000000) {
            // @todo melhorar alerts
            window.alert('O arquivo informado é maior de 2MB. Envie um arquivo menor.');

            return;
        }

        if (!['image/jpg', 'image/jpeg', 'image/png'].includes(file.type)) {
            window.alert('Apenas arquivos de imagem são aceitos, como png e jpg');

            return;
        }

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const uploadedImageElement = new Image(1080, 1170);
                uploadedImageElement.src = e.target.result;
                uploadedImageElement.alt = 'Modelo de Cartaz #EuVou';
                uploadedImage = uploadedImageElement;
                result.html(uploadedImage);
                buttonLink.hide();
                buttonCortar.show();

                setTimeout(() => {
                    if (uploadedImage) {
                        // Crie um elemento de tela de canvas para mesclar as imagens
                        const canvas = document.createElement('canvas');
                        canvas.width = predefinedImage.width;
                        canvas.height = predefinedImage.height;
                        const ctx = canvas.getContext('2d');

                        var cropper = new Cropper(uploadedImage, {
                            aspectRatio: 1 / 1.1083, // 1170 / 1080
                            viewMode: 3,
                            dragMode: 'move',
                            center: true,
                            minCropBoxWidth: 650,
                            minCropBoxHeight: 150,
                            cropBoxMovable: true,
                            cropBoxResizable: true,
                            ready: function (event) {
                                // cropper.zoomTo(1);
                            },

                            crop: function (event) {
                                cropper.scale(1, 1);
                            },

                            zoom: function (event) {
                                if (event.detail.oldRatio === 1) {
                                    event.preventDefault();
                                }
                            }
                        });

                        buttonCortar.on('click', (e) => {
                            result.innerHTML = '';
                            ctx.drawImage(cropper.getCroppedCanvas(), 0, 0, 1080, 1170);
                            ctx.drawImage(predefinedImage, 0, 0, 1080, 1170);

                            const mergedImage = new Image();
                            mergedImage.src = canvas.toDataURL('image/png');
                            result.html(mergedImage);
                            buttonCortar.hide();
                            buttonLink.attr('href', mergedImage.src).show();
                        });
                    }
                }, 50);
            };
            reader.readAsDataURL(file);
        }
    });
});
