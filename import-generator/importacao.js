const fs = require('fs-extra');
const recursive = require('recursive-readdir');
const hashGit = require('git-rev-sync');

class Importacao {
    constructor() {
        this.lib = 'ERRO NO IMPORT GENERATOR: ';
    }

    gerarImportacao(destino, diretorio) {
        const stream = fs.createWriteStream(destino);
        const isCSS = destino.substr(-3);
        let lang = [];

        lang[0] = isCSS === 'css' ? '@' : ''; // prefixo de importação
        lang[1] = isCSS === 'css' ? 'css' : 'js'; // diretorio

        if (fs.existsSync(diretorio)) {
            stream.once('open', () => {
                this.buscarArquivos(diretorio, lang)
                    .then((res) => {
                        if (res) {
                            stream.write(res);
                            stream.end();
                        } else {
                            this.excluirBundleComErro(destino, 'Não há arquivos no diretório: ', diretorio);
                        }
                    })
                    .catch(function (erro) {
                        console.log(erro);
                    });
            });
        } else {
            this.excluirBundleComErro(destino, 'Diretório inexistente: ', diretorio);
        }
    }

    buscarArquivos(diretorio, lang) {
        return new Promise((resolve, reject) => {
            recursive(diretorio, (err, files) => {
                const importar = files
                    .sort()
                    .map((val) => lang[0] + "import '" + val.replace('assets/' + lang[1] + '/', './') + "';");
                resolve(importar.join('\n'));
                reject(err);
            });
        });
    }

    excluirBundleComErro(destino, mensagem, diretorio) {
        fs.unlink(destino, (err) => {
            if (err) throw err;
            console.log('\x1b[31m', this.lib + mensagem + diretorio);
        });
    }

    hasFolderDist(dist) {
        if (!fs.existsSync(dist)) {
            fs.mkdir(dist, { recursive: true }, (err) => {
                if (err) throw err;
            });
        }
    }

    gerarHash(destino) {
        const stream = fs.createWriteStream(destino);

        stream.write(
            JSON.stringify({
                hash: `.${hashGit.short()}`
            })
        );
    }

    gerarUrlAssetsSigfacil(destino) {
        const stream = fs.createWriteStream(destino);

        process.argv.forEach(function (val, index) {
            if (index === 2) {
                const env = val;
                const linkAssets = `//${env === 'www' ? env + '.' : env + '-'}sigfacil.staticvox.com.br/`;

                stream.write(`$assetsSigfacil: "${linkAssets}";`);
            }
        });
    }
}

module.exports = Importacao;
