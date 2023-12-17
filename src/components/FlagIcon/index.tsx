
const countryCodeToFlag = (isoCode: string) => {
    return typeof String.fromCodePoint !== 'undefined'
        ? isoCode
            .toUpperCase()
            .replace(/./g, char =>
                String.fromCodePoint(char.charCodeAt(0) + 127397)
            )
        : isoCode;
};

interface FlagIconProps {
    isoCode: string;
}

const FlagIcon = ({ isoCode }: FlagIconProps) => {
    return <span style={{ fontSize: '28px' }} >{countryCodeToFlag(isoCode)}</span>;
};

export default FlagIcon;
