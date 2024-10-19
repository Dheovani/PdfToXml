import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Translations = {
    [key: string]: { [languageCode: string]: string };
}

export enum Language {
    EN = 'en',
    PT = 'pt',
    ES = 'es',
    ZH = 'zh',
    JA = 'ja',
    FR = 'fr',
    DE = 'de',
    RU = 'ru',
    HI = 'hi'
}

export enum TranslationKey {
    SELECT_DIRECTORY = 'select_directory',
    EXAMPLE_PATH = 'example_path',
    DRAG_AND_DROP = 'drag_and_drop',
    PROCESS_DATA = 'process_data',
    OPEN_DIRECTORY = 'open_directory',
    PROVIDE_OUTPUT_PATH = 'provide_output_path',
    LOAD_PDF_FILES = 'load_pdf_files',
    PASSWORD_LABEL = 'password_label',
    PASSWORD_PLACEHOLDER = 'password_placeholder',
    PASSWORD_TOOLTIP = 'password_tooltip',
    CLEAR_ATTACHMENT_LIST = 'clear_attachment_list'
}

interface TranslationContextInterface {
    language: Language,
    translate: (key: TranslationKey, language?: Language) => string
}

const translations: Translations = {
    [TranslationKey.SELECT_DIRECTORY]: {
        [Language.EN]: "Select the directory where the XML file will be saved",
        [Language.PT]: "Selecione o diretório onde o arquivo XML será salvo",
        [Language.ES]: "Seleccione el directorio donde se guardará el archivo XML",
        [Language.ZH]: "选择保存 XML 文件的目录",
        [Language.JA]: "XMLファイルが保存されるディレクトリを選択してください",
        [Language.FR]: "Sélectionnez le répertoire où le fichier XML sera enregistré",
        [Language.DE]: "Wählen Sie das Verzeichnis, in dem die XML-Datei gespeichert wird",
        [Language.RU]: "Выберите каталог, в который будет сохранен файл XML",
        [Language.HI]: "वह डायरेक्टरी चुनें जहाँ XML फ़ाइल सहेजी जाएगी"
    },
    [TranslationKey.EXAMPLE_PATH]: {
        [Language.EN]: "Example: C:\\Users\\Example",
        [Language.PT]: "Exemplo: C:\\Usuários\\Exemplo",
        [Language.ES]: "Ejemplo: C:\\Usuarios\\Ejemplo",
        [Language.ZH]: "示例: C:\\用户\\示例",
        [Language.JA]: "例: C:\\Users\\Example",
        [Language.FR]: "Exemple : C:\\Utilisateurs\\Exemple",
        [Language.DE]: "Beispiel: C:\\Benutzer\\Beispiel",
        [Language.RU]: "Пример: C:\\Пользователи\\Пример",
        [Language.HI]: "उदाहरण: C:\\उपयोगकर्ता\\उदाहरण"
    },
    [TranslationKey.DRAG_AND_DROP]: {
        [Language.EN]: "Drag and drop files here",
        [Language.PT]: "Arraste e solte os arquivos aqui",
        [Language.ES]: "Arrastra y suelta los archivos aquí",
        [Language.ZH]: "将文件拖放到此处",
        [Language.JA]: "ここにファイルをドラッグ＆ドロップ",
        [Language.FR]: "Glissez-déposez les fichiers ici",
        [Language.DE]: "Dateien hierher ziehen und ablegen",
        [Language.RU]: "Перетащите файлы сюда",
        [Language.HI]: "फ़ाइलें यहाँ खींचें और छोड़ें"
    },
    [TranslationKey.PROCESS_DATA]: {
        [Language.EN]: "Process data",
        [Language.PT]: "Processar dados",
        [Language.ES]: "Procesar datos",
        [Language.ZH]: "处理数据",
        [Language.JA]: "データを処理する",
        [Language.FR]: "Traiter les données",
        [Language.DE]: "Daten verarbeiten",
        [Language.RU]: "Обработать данные",
        [Language.HI]: "डेटा संसाधित करें"
    },
    [TranslationKey.OPEN_DIRECTORY]: {
        [Language.EN]: "Open directory",
        [Language.PT]: "Abrir diretório",
        [Language.ES]: "Abrir directorio",
        [Language.ZH]: "打开目录",
        [Language.JA]: "ディレクトリを開く",
        [Language.FR]: "Ouvrir le répertoire",
        [Language.DE]: "Verzeichnis öffnen",
        [Language.RU]: "Открыть каталог",
        [Language.HI]: "निर्देशिका खोलें"
    },
    [TranslationKey.PROVIDE_OUTPUT_PATH]: {
        [Language.EN]: "Please provide an output path to save the files.",
        [Language.PT]: "Por favor, defina um diretório para salvar os arquivos.",
        [Language.ES]: "Por favor, proporcione un directorio para guardar los archivos.",
        [Language.ZH]: "请提供保存文件的目录。",
        [Language.JA]: "ファイルを保存するディレクトリを指定してください。",
        [Language.FR]: "Veuillez fournir un répertoire pour enregistrer les fichiers.",
        [Language.DE]: "Bitte geben Sie ein Verzeichnis zum Speichern der Dateien an.",
        [Language.RU]: "Пожалуйста, укажите каталог для сохранения файлов.",
        [Language.HI]: "कृपया फाइलों को सहेजने के लिए एक निर्देशिका प्रदान करें।"
    },
    [TranslationKey.LOAD_PDF_FILES]: {
        [Language.EN]: "Please upload the PDF files before processing the data.",
        [Language.PT]: "Por favor, faça o upload dos arquivos PDF antes de processar os dados.",
        [Language.ES]: "Por favor, cargue los archivos PDF antes de procesar los datos.",
        [Language.ZH]: "请在处理数据之前上传 PDF 文件。",
        [Language.JA]: "データを処理する前に、PDFファイルをアップロードしてください。",
        [Language.FR]: "Veuillez télécharger les fichiers PDF avant de traiter les données.",
        [Language.DE]: "Bitte laden Sie die PDF-Dateien hoch, bevor Sie die Daten verarbeiten.",
        [Language.RU]: "Пожалуйста, загрузите файлы PDF перед обработкой данных.",
        [Language.HI]: "कृपया डेटा संसाधित करने से पहले PDF फाइलें अपलोड करें।"
    },
    [TranslationKey.PASSWORD_LABEL]: {
        [Language.EN]: "Password-protected file",
        [Language.PT]: "Arquivo com senha",
        [Language.ES]: "Archivo protegido con contraseña",
        [Language.ZH]: "密码保护的文件",
        [Language.JA]: "パスワード保護されたファイル",
        [Language.FR]: "Fichier protégé par mot de passe",
        [Language.DE]: "Kennwortgeschützte Datei",
        [Language.RU]: "Файл, защищённый паролем",
        [Language.HI]: "पासवर्ड-संरक्षित फ़ाइल"
    },
    [TranslationKey.PASSWORD_PLACEHOLDER]: {
        [Language.EN]: "Enter your password",
        [Language.PT]: "Digite sua senha",
        [Language.ES]: "Ingrese su contraseña",
        [Language.ZH]: "输入你的密码",
        [Language.JA]: "パスワードを入力してください",
        [Language.FR]: "Entrez votre mot de passe",
        [Language.DE]: "Geben Sie Ihr Passwort ein",
        [Language.RU]: "Введите ваш пароль",
        [Language.HI]: "अपना पासवर्ड दर्ज करें"
    },
    [TranslationKey.PASSWORD_TOOLTIP]: {
        [Language.EN]: "If the PDF files are password-protected, you need to enable this field and enter the password. "
        + "Please ensure that the file passwords are standard.",
        [Language.PT]: "Se os arquivos PDF possuírem senhas, é necessário habilitar esse campo e inserir a senha. "
            + "Por favor, garanta que a senha dos arquivos seja padrão.",
        [Language.ES]: "Si los archivos PDF tienen contraseñas, debe habilitar este campo e ingresar la contraseña. "
            + "Por favor, asegúrese de que las contraseñas de los archivos sean estándar.",
        [Language.ZH]: "如果PDF文件有密码, 您需要启用此字段并输入密码。"
            + "请确保文件密码为标准密码。",
        [Language.JA]: "PDFファイルにパスワードが設定されている場合、このフィールドを有効にしてパスワードを入力してください。"
            + "ファイルのパスワードが標準的なものであることを確認してください。",
        [Language.FR]: "Si les fichiers PDF sont protégés par un mot de passe, vous devez activer ce champ et saisir le mot de passe. "
            + "Veuillez vous assurer que les mots de passe des fichiers sont standard.",
        [Language.DE]: "Wenn die PDF-Dateien passwortgeschützt sind, müssen Sie dieses Feld aktivieren und das Passwort eingeben. "
            + "Bitte stellen Sie sicher, dass die Passwörter der Dateien Standard sind.",
        [Language.RU]: "Если PDF-файлы защищены паролем, необходимо включить это поле и ввести пароль. "
            + "Пожалуйста, убедитесь, что пароли файлов являются стандартными.",
        [Language.HI]: "यदि PDF फ़ाइलों में पासवर्ड हैं, तो आपको इस फ़ील्ड को सक्षम करना होगा और पासवर्ड दर्ज करना होगा। "
            + "कृपया सुनिश्चित करें कि फ़ाइल पासवर्ड मानक हैं।"
    },
    [TranslationKey.CLEAR_ATTACHMENT_LIST]: {
        [Language.EN]: "Clear attachments",
        [Language.PT]: "Apagar anexos",
        [Language.ES]: "Borrar archivos adjuntos",
        [Language.ZH]: "清除附件",
        [Language.JA]: "添付ファイルをクリア",
        [Language.FR]: "Effacer les pièces jointes",
        [Language.DE]: "Anhänge löschen",
        [Language.RU]: "Очистить вложения",
        [Language.HI]: "संलग्नक साफ़ करें"
    }
};

const TranslationContext = createContext<TranslationContextInterface | undefined>(undefined);

export const useTranslation = (): TranslationContextInterface => {
    const context = useContext(TranslationContext);

    if (!context)
        throw new Error('useLanguage must be used within a LanguageProvider');

    return context;
};

const TranslationProvider = ({ children }) => {
    const [language, setLanguage] = useState(Language.PT);

    const getLanguage = useCallback(async (): Promise<Language> => {
        return await window.electron.getLanguage();
    }, []);

    useEffect(() => {
        const loadLanguage = async () => {
            const userLanguage = await getLanguage();
            setLanguage(userLanguage);
        };

        loadLanguage();
    }, [language, setLanguage, getLanguage]);

    const translate = useCallback((key: TranslationKey, lang?: Language): string => {
        if (!lang) {
            lang = language;
        }
    
        return translations[key]?.[language] || key;
    }, [language]);

    return (
        <TranslationContext.Provider value={{ language, translate }}>
            {children}
        </TranslationContext.Provider>
    );
};

export default TranslationProvider;
