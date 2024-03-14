import { useEffect, useState } from "react";
import isValidEmail from "../../hook/isValidEmail";
import { useGetUserQuery } from "../../features/users/usersApi";
import Error from "../ui/Error";
import { useDispatch, useSelector } from "react-redux";
import { conversationApi, useAddCoversationMutation, useEditCoversationMutation } from "../../features/conversation/conversationApi";

export default function Modal({ open, control }) {
    const [to, setTo] = useState('');
    const [message, setMessage] = useState('');
    const [userCheck, setUserCheck] = useState(false);
    const [errs, setErrs] = useState('');
    const [conversation, setConversation] = useState(undefined);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { data } = useGetUserQuery(to, {
        skip: !userCheck //true hole request jbe na
    });

    const [addCoversation, { data: addData, isError, isLoading, error, isSuccess }] = useAddCoversationMutation();
    const [editCoversation, { data: editData, isSuccess: suceesing }] = useEditCoversationMutation();
    // check coversation ase nki
    useEffect(() => {
        if (data?.length > 0 && data[0]?.email !== user?.email) {
            dispatch(conversationApi.endpoints.getAcoversation.initiate({
                userEmail: user?.email,
                participantEmail: to,
            }))
                .unwrap()
                .then((data) => {
                    setConversation(data);

                })
                .catch((err) => {
                    setErrs(err)
                })
        }
    }, [data, dispatch, to, user?.email]);


    useEffect(() => {
        if (isSuccess || suceesing) {
            control();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, suceesing])
    // check valid email
    const debounceHandler = (fn, delay) => {
        let timeOutId;
        return (...args) => {
            clearTimeout(timeOutId);
            timeOutId = setTimeout(() => {
                fn(...args) // ...args means got e.target.value
            }, delay);
        }
    }
    const doSearch = (value) => {
        if (isValidEmail(value)) {
            setUserCheck(true);
            setTo(value);

        }
    }
    const handleSearch = debounceHandler(doSearch, 800);

    //submit
    const handleSubmit = (e) => {
        e.preventDefault();
        if (conversation?.length > 0) {
            //edit
            editCoversation({
                id: conversation[0]?.id,
                sender: user?.email,
                data: {
                    participants: `${user?.email}-${data[0]?.email}`,
                    users: [user, data[0]],
                    message,
                    timestamp: new Date().getTime(),

                }
            })
        }
        if (conversation?.length === 0) {
            addCoversation({
                sender: user?.email,
                data: {
                    participants: `${user?.email}-${data[0]?.email}`,
                    users: [user, data[0]],
                    message,
                    timestamp: new Date().getTime(),

                }
            })
        }
    }

    return (
        open && (
            <>
                <div
                    onClick={control}
                    className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"
                ></div>
                <div className="rounded w-[400px] lg:w-[600px] space-y-8 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Send message
                    </h2>
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <input type="hidden" name="remember" value="true" />
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="to" className="sr-only">
                                    To
                                </label>
                                <input
                                    onChange={(e) => handleSearch(e.target.value)}
                                    id="to"
                                    name="to"
                                    type="email"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                                    placeholder="Send to"

                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="sr-only">
                                    Message
                                </label>
                                <textarea
                                    onChange={(e) => setMessage(e.target.value)}
                                    id="message"
                                    name="message"
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                                    placeholder="Message"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                disabled={conversation === undefined || data[0]?.email === user?.email}
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                            >
                                Send Message
                            </button>
                        </div>
                        {/* check error */}
                        {data?.length === 0 && <Error message="This user not exist!!" />}
                        {data?.length > 0 && data[0]?.email === user?.email && <Error message="You cannot message yourself!!" />}
                        {errs && <Error message={errs} />}
                    </form>
                </div>
            </>
        )
    );
}
