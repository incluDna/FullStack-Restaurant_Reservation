"using client"

import Image from "next/image";

export default function ReserveManageCard() {
    const validResCor = '[#FFECAD]';
    const invalidResCor = 'gray-100';
    return (
        <div className={`w-full h-[200px] bg-${validResCor} rounded-[30px] drop-shadow-md p-4 flex flex-row`}>
            <div className="grow h-full flex flex-col">
                <div className="text-left text-3xl">13.00 AM</div>
                <div className="text-left text-lg">id</div>
                <div className="text-left text-lg">name</div>
                <div className="text-left text-lg">tel</div>
                <div className="text-left text-lg">seats</div>
            </div>
            <div className="w-[40px] h-full flex flex-col gap-y-3">
                <div className="bg-white rounded-[40px] h-[40px] w-[40px] flex justify-center">
                    <Image
                        src="/images/tick.svg"
                        alt=""
                        width={35}
                        height={35}
                        style={{objectFit: "contain"}}
                    />
                </div>
                <div className="bg-white rounded-[40px] h-[40px] w-[40px] flex justify-center">
                <Image
                        src="/images/cross.svg"
                        alt=""
                        width={40}
                        height={40}
                        style={{objectFit: "contain"}}
                    />
                </div>
            </div>
        </div>
    );
}

