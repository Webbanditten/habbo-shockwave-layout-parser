interface LayoutParserProps {
    elements: string | null;
}
const LayoutParser = (props: LayoutParserProps) => {
    return <>{props.elements}</>;
}

export default LayoutParser;
