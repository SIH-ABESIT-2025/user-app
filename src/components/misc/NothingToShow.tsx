interface NothingToShowProps {
    type?: 'complaints' | 'general';
    message?: string;
}

export default function NothingToShow({ type = 'general', message="everything's empty here....." }: NothingToShowProps) {
    const getContent = () => {
        if (message) {
            return { title: message, subtitle: "" };
        }
        
        switch (type) {
            case 'complaints':
                return {
                    title: "No complaints found",
                    subtitle: "No civic issues match your current filters. Try adjusting your search criteria."
                };
            default:
                return {
                    title: "Nothing to see here",
                    subtitle: "¯\\_(ツ)_/¯"
                };
        }
    };

    const { title, subtitle } = getContent();

    return (
        <div className="nothing-to-show">
            <h1>{title}</h1>
            <p>{subtitle}</p>
        </div>
    );
}
