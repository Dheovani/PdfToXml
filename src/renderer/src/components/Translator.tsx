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
    DRAG_AND_DROP = 'drag_and_drop'
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
    }, [getLanguage, setLanguage]);

    // TODO: Corrigir problemas com a tradução
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
