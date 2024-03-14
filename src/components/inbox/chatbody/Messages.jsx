import Message from "./Message";
import { useSelector } from "react-redux";

export default function Messages({ messages }) {
    const { user } = useSelector((state) => state.auth)

    return (
        <div className="relative w-full h-[calc(100vh_-_197px)] p-6 overflow-y-auto flex flex-col-reverse">
            <ul className="space-y-2">
                {messages.slice().sort((a, b) => a.timestamp - b.timestamp).map((m) => <Message justify={m?.sender.email !== user?.email ? 'start' : 'end'} message={m?.message} />)}

            </ul>
        </div>
    );
}
