import {Evidence, Ghost} from './models.js';

export const evidenceLabels: Record<Evidence, string> = {
    [Evidence.EMF]: 'ЭМП',
    [Evidence.ULTRAVIOLET]: 'Ультрафиолет',
    [Evidence.GHOST_WRITING]: 'Записи в блокноте',
    [Evidence.FREEZING_TEMPERATURE]: 'Минусовая температура',
    [Evidence.DOTS_PROJECTOR]: 'Лазерный проектор',
    [Evidence.GHOST_ORB]: 'Призрачный огонек',
    [Evidence.SPIRIT_BOX]: 'Радиоприемник',
};

export const ghostLabels: Record<Ghost, string> = {
    [Ghost.BANSHEE]: 'Банши',
    [Ghost.DEMON]: 'Демон',
    [Ghost.DEOGEN]: 'Деоген',
    [Ghost.GORYO]: 'Горё',
    [Ghost.HANTU]: 'Ханту',
    [Ghost.JINN]: 'Джинн',
    [Ghost.MARE]: 'Мара',
    [Ghost.MOROI]: 'Морой',
    [Ghost.MYLING]: 'Мюлинг',
    [Ghost.OBAKE]: 'Обаке',
    [Ghost.ONI]: 'Они',
    [Ghost.ONRYO]: 'Онрё',
    [Ghost.PHANTOM]: 'Фантом',
    [Ghost.POLTERGEIST]: 'Полтергейст',
    [Ghost.RAIJU]: 'Райдзю',
    [Ghost.REVENANT]: 'Ревенант',
    [Ghost.SHADE]: 'Тень',
    [Ghost.SPIRIT]: 'Дух',
    [Ghost.THAYE]: 'Тайэ',
    [Ghost.THE_MIMIC]: 'Мимик',
    [Ghost.THE_TWINS]: 'Близнецы',
    [Ghost.WRAITH]: 'Мираж',
    [Ghost.YOKAI]: 'Ёкай',
    [Ghost.YUREI]: 'Юрэй',
};
