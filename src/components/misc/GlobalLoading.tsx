import Image from "next/image";

export default function GlobalLoading() {
    return (
        <div className="global-loading-wrapper">
            <Image src={"/icon.svg"} className="bird" alt="Jharkhand Government" width={100} height={100} />
        </div>
    );
}
