import Image from "next/image";
import { FaTwitter } from "react-icons/fa";

export default function GlobalLoading() {
    return (
        <div className="global-loading-wrapper">
            <Image src={"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Jharkhand_Rajakiya_Chihna.svg/1200px-Jharkhand_Rajakiya_Chihna.svg.png"} className="bird" alt="" width={100} height={100} />
        </div>
    );
}
