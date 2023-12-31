import $ from 'jquery';
import Cropper from 'cropperjs';

$(() => {
    let uploadedImage = null;
    let dadosCartaz = null;
    let buttonCortar = $('#btn-cortar');
    let msgCortar = $('#msg-cortar');
    let msgInicial = $('#msg-inicial');
    let msgFinal = $('#msg-final');
    let msgFinaliOS = $('#msg-final-ios');
    let buttonLink = $('#downloadLink');
    let buttonReload = $('#btnReload');
    let result = $('#resultImage');
    let modeloNiver = $('#field-modelo');
    const isIphone = window.navigator.userAgent.toLowerCase().indexOf('iphone') > -1;

    // Carregue a imagem predefinida
    const predefinedImage = new Image();
    const urlParams = new URLSearchParams(window.location.search);
    const eventName = urlParams.get('evento');
    const typeCartaz = urlParams.get('cartaz');
    predefinedImage.src = `./assets/images/${typeCartaz}/${eventName}${typeCartaz === 'niver' ? '-0' : ''}.png`;

    modeloNiver.on('change', () => {
        predefinedImage.src = `./assets/images/${typeCartaz}/${eventName}-${modeloNiver[0].value}.png`;
    });

    predefinedImage.onload = function () {
        $('#resultImage').html(predefinedImage);

        if (localStorage.getItem(eventName) && localStorage.getItem(eventName).length) {
            dadosCartaz = JSON.parse(atob(localStorage.getItem(eventName)));
            setDadosCartaz();

            return;
        }

        fetch(`./assets/configs/${typeCartaz}/${eventName}.json`)
            .then((response) => response.json())
            .then((response) => {
                dadosCartaz = response;
                localStorage.setItem(eventName, btoa(JSON.stringify(dadosCartaz)));
                setDadosCartaz();
            });
    };

    predefinedImage.onerror = () => {
        $('#wrapper').hide();
        $('#msg-error').show();
        // @todo ajustar index
        fetch(`./assets/configs/index.json`)
            .then((response) => response.json())
            .then((response) => {
                console.log(response);
            });
    };

    function setDadosCartaz() {
        if (dadosCartaz) {
            window.document.title += ' - ' + dadosCartaz.data.shortTitle;
            predefinedImage.alt = dadosCartaz.data.title;
            predefinedImage.width = dadosCartaz.sizes.width;
            predefinedImage.height = dadosCartaz.sizes.height;
            $('#border-secondary').css('background-color', dadosCartaz.colors.secondary);
            $('#date').css('color', dadosCartaz.colors.secondary);
            $('#content-evento').css('background-color', dadosCartaz.colors.primary);
            $('#title').html(dadosCartaz.data.title);
            $('#date').html(dadosCartaz.data.date);
            $('#link-evento').attr('href', dadosCartaz.data.link).css('color', dadosCartaz.colors.text);
            $('h4').css('color', dadosCartaz.colors.primary);
        } else {
            localStorage.removeItem(eventName);
        }
    }

    function dateFix(dateInput) {
        return dateInput ? new Date(dateInput.replaceAll('-', '/')).toLocaleDateString().slice(0, 5) : null;
    }

    function generateTextNiver(ctx) {
        ctx.textAlign = 'center';
        let nomeNiver = $('#field-nome')[0].value;
        let subtitleNiver = $('#field-subtitle')[0].value;
        let dataNiver = dateFix($('#field-data')[0].value);
        let modeloNiver = $('#field-modelo')[0].value;

        if (nomeNiver) {
            ctx.font = 'bold 75px sans-serif';
            ctx.fillStyle = dadosCartaz.colors.primary;
            ctx.fillText(
                nomeNiver,
                dadosCartaz.niver.aniversariante[modeloNiver]['x'],
                dadosCartaz.niver.aniversariante[modeloNiver]['y']
            );
        }

        if (subtitleNiver) {
            ctx.font = 'italic normal 55px serif';
            ctx.fillStyle = '#000';
            ctx.fillText(
                subtitleNiver,
                dadosCartaz.niver.subtitle[modeloNiver]['x'],
                dadosCartaz.niver.subtitle[modeloNiver]['y']
            );
        }

        if (dataNiver) {
            ctx.font = 'bold 55px sans-serif';
            ctx.fillStyle = '#000';
            ctx.fillText(dataNiver, dadosCartaz.niver.data[modeloNiver]['x'], dadosCartaz.niver.data[modeloNiver]['y']);
        }
    }

    // Manipule o upload da imagem
    $('#uploadImage').on('change', (e) => {
        const file = e.target.files[0];

        if (file.size > 5000000) {
            window.alert('O arquivo enviado é maior de 5mb. Envie um arquivo menor.');

            return;
        }

        if (!['image/webp', 'image/heif', 'image/heic', 'image/jpg', 'image/jpeg', 'image/png'].includes(file.type)) {
            window.alert('Apenas arquivos de imagem são aceitos.');

            return;
        }

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const uploadedImageElement = new Image(dadosCartaz.sizes.width, dadosCartaz.sizes.height);
                uploadedImageElement.src = e.target.result;
                uploadedImageElement.alt = 'Modelo de Cartaz #EuVou';
                uploadedImage = uploadedImageElement;
                result.html(uploadedImage);

                buttonLink.hide();
                msgInicial.hide();
                msgCortar.show();
                buttonCortar.show();

                if (uploadedImage) {
                    // Crie um elemento de tela de canvas para mesclar as imagens
                    const canvas = document.createElement('canvas');
                    canvas.width = predefinedImage.width;
                    canvas.height = predefinedImage.height;
                    const ctx = canvas.getContext('2d');

                    var cropper = new Cropper(uploadedImage, {
                        aspectRatio: 1 / (dadosCartaz.sizes.height / dadosCartaz.sizes.width),
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
                            dadosCartaz.sizes.width,
                            dadosCartaz.sizes.height
                        );
                        ctx.drawImage(predefinedImage, 0, 0, dadosCartaz.sizes.width, dadosCartaz.sizes.height);

                        if (typeCartaz === 'niver') {
                            generateTextNiver(ctx);
                        }

                        const mergedImage = new Image();
                        mergedImage.src = canvas.toDataURL('image/png');
                        result.html(mergedImage);

                        msgCortar.hide();
                        buttonCortar.hide();

                        $('#field-nome')[0].value = null;
                        $('#field-subtitle')[0].value = null;
                        $('#field-data')[0].value = null;

                        if (!isIphone) {
                            msgFinal.show();
                            buttonLink.attr('href', mergedImage.src).show();
                        } else {
                            msgFinaliOS.show();
                        }
                        buttonReload.show();
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    });

    $('#btnCreditos').on('click', () => {
        $('#creditosDesc').toggle(300);
    });

    $('#btnReload').on('click', () => {
        window.location.reload();
    });

    $('#btnReloadDados').on('click', () => {
        localStorage.removeItem(eventName);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.location.reload();
    });
});
