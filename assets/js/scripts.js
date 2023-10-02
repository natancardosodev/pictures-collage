import $ from 'jquery';
import Cropper from 'cropperjs';

$(() => {
    let uploadedImage = null;
    let dadosEvento = null;
    let buttonCortar = $('#btn-cortar');
    let buttonLink = $('#downloadLink');
    let result = $('#resultImage');

    // Carregue a imagem predefinida
    const predefinedImage = new Image();
    const urlParams = new URLSearchParams(window.location.search);
    const eventName = urlParams.get('evento');
    predefinedImage.src = `./assets/images/${eventName}.png`;

    predefinedImage.onload = function () {
        $('#resultImage').html(predefinedImage);

        if (localStorage.getItem(eventName) && localStorage.getItem(eventName).length) {
            dadosEvento = JSON.parse(atob(localStorage.getItem(eventName)));
            setDadosEvento();

            return;
        }

        fetch(`./assets/configs/${eventName}.json`)
            .then((response) => response.json())
            .then((response) => {
                dadosEvento = response;
                localStorage.setItem(eventName, btoa(JSON.stringify(dadosEvento)));
                setDadosEvento();
            });
    };

    predefinedImage.onerror = () => {
        $('#wrapper').hide();
        $('#msg-error').show();
    };

    function setDadosEvento() {
        if (dadosEvento) {
            window.document.title += ' - ' + dadosEvento.data.shortTitle;
            predefinedImage.alt = dadosEvento.data.title;
            predefinedImage.width = dadosEvento.sizes.width;
            predefinedImage.height = dadosEvento.sizes.height;
            $('#border-secondary').css('background-color', dadosEvento.colors.secondary);
            $('#content-evento').css('background-color', dadosEvento.colors.primary);
            $('#title').html(dadosEvento.data.title);
            $('#date').html(dadosEvento.data.date);
            $('#link-evento').attr('href', dadosEvento.data.link).css('color', dadosEvento.colors.text);
            $('h4').css('color', dadosEvento.colors.primary);
        } else {
            localStorage.removeItem(eventName);
        }
    }

    // Manipule o upload da imagem
    $('#uploadImage').on('change', (e) => {
        const file = e.target.files[0];

        if (file.size > 3000000) {
            // @todo melhorar alerts
            window.alert('O arquivo informado é maior de 3MB. Envie um arquivo menor.');

            return;
        }

        if (!['image/heif', 'image/heic', 'image/jpg', 'image/jpeg', 'image/png'].includes(file.type)) {
            window.alert('Apenas arquivos de imagem são aceitos, como jpg.');

            return;
        }

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const uploadedImageElement = new Image(dadosEvento.sizes.width, dadosEvento.sizes.height);
                uploadedImageElement.src = e.target.result;
                uploadedImageElement.alt = 'Modelo de Cartaz #EuVou';
                uploadedImage = uploadedImageElement;
                result.html(uploadedImage);
                buttonLink.hide();
                buttonCortar.show();

                if (uploadedImage) {
                    // Crie um elemento de tela de canvas para mesclar as imagens
                    const canvas = document.createElement('canvas');
                    canvas.width = predefinedImage.width;
                    canvas.height = predefinedImage.height;
                    const ctx = canvas.getContext('2d');

                    var cropper = new Cropper(uploadedImage, {
                        aspectRatio: 1 / (dadosEvento.sizes.height / dadosEvento.sizes.width),
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
                        ctx.drawImage(
                            cropper.getCroppedCanvas(),
                            0,
                            0,
                            dadosEvento.sizes.width,
                            dadosEvento.sizes.height
                        );
                        ctx.drawImage(predefinedImage, 0, 0, dadosEvento.sizes.width, dadosEvento.sizes.height);

                        const mergedImage = new Image();
                        mergedImage.src = canvas.toDataURL('image/png');
                        result.html(mergedImage);
                        buttonCortar.hide();
                        buttonLink.attr('href', mergedImage.src).show();
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    });

    $('#btnCreditos').on('click', () => {
        $('#creditosDesc').toggle(300);
    });
});
