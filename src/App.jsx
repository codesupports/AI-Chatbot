import React, { useState } from 'react'
import Markdown from 'react-markdown'
import AssistantIcon from './assets/Assitance.png'


import { API_KEY, URL } from './Util';
import Loader from './Loader';

function App() {

  const [question, setQuestion] = useState(""); // to store the current question being typed by the user
  const [data, setData] = useState([]); // to store the history of questions and answers in the chat interface. Each entry in this array is an object that contains the question, answer, and their respective timestamps.

  const [result, setResult] = useState();

  const handleAdd = (e) => { //
    e.preventDefault();
    if (!question.trim()) {
      return;
    }

    const time = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const id = Date.now();
    setData((prev) => [...prev, { id, ask: question, askTime: time, answer: null, answerTime: null, loading: true, error: false }]);
    setQuestion("");
    fetchData(question, id);
  };

  const fetchData = async (prompt, id) => {
    const response = await fetch(`${URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const data = await response.json();

    const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const time = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    setResult(aiText);

    if (aiText) {
      setData((prev) => prev.map((item) => (item.id === id ? { ...item, answer: aiText, answerTime: time, loading: false, error: false } : item)));
    } else {
      // mark this item as failed
      setData((prev) => prev.map((item) => (item.id === id ? { ...item, loading: false, error: true } : item)));
    }
  };

  return (
    <>

      <div className='conatainer w-full md:w[768px] lg:w-[1024px] lg:m-auto px-2  my-2.5 h-[95vh] '>
        <div className='bg-gradient-to-r from-[#3a5df6] to-[#f260e2] p-5 rounded-tl-lg rounded-tr-lg mt-2'>
          <div className='w-[60px] h-[60px] bg-white rounded-full  text-[#4629f2] flex items-center justify-center font-bold text-2xl'>
            R
          </div>
          <h1 className='pt-6 pb-3 font-bold text-[24px]'>Chat Flow</h1>
          <p className='text-[12px]'>A live chat interface that allows for seamless, natural communication and connection</p>
        </div>
        <div className='text-gray-900 w-full  h-[calc(100%-180px)]  relative '>
          <div className='overflow-y-auto h-[calc(100%-80px)] bg-[#0d082c]'>
            <ul className='p-5'>
              {data.length === 0 ? (
                <li className="flex justify-start mb-2">
                  <div className="w-fit bg-[#1d1748] text-[#ededf1] py-1 px-2 text-[14px] rounded-xl rounded-tl-none">
                    Start the chat by typing a message below.
                    <span className='block text-[10px]'>Welcome</span>
                  </div>
                </li>
              ) : (
                data.map((item) => (
                  <React.Fragment key={item.id}>
                    <li className="flex justify-end mb-2">
                      <div className="w-fit ml-20 bg-blue-600 text-white py-3 px-5 mb-4 text-[16px] text-right rounded-xl rounded-tr-none">
                        {item.ask}
                        <span className='block text-[10px]'>{item.askTime}</span>
                      </div>
                    </li>
                    {item.loading && (
                      <li className=" flex justify-start mb-2">
                        <div className="bg-white w-[40px] h-[40px] rounded-full flex items-center justify-center text-[#4629f2] font-bold text-xl mr-2 relative after:content-['Assistant'] after:absolute after:left-[45px] after:top-[-20px] after:text-[11px] after:text-white after:font-normal ">
                          <img src={AssistantIcon} alt="Assistant" className='w-7 h-7 rounded-full' />
                        </div>
                        <div className="w-fit bg-[#1d1748] text-[#ededf1] py-5 px-3 text-[14px] rounded-xl rounded-tl-none">
                          <Loader />
                        </div>
                      </li>
                    )}

                    {!item.loading && item.answer && (
                      <li className=" flex justify-start mb-2">
                        <div className="bg-white w-[40px] h-[40px] rounded-full flex items-center justify-center text-[#4629f2] font-bold text-xl mr-2 relative after:content-['Assistant'] after:absolute after:left-[45px] after:top-[-20px] after:text-[11px] after:text-white after:font-normal ">
                          <img src={AssistantIcon} alt="Assistant" className='w-7 h-7 rounded-full' />
                        </div>
                        <div className="w-fit bg-[#1d1748] text-[#ededf1] py-3 px-3 text-[14px] rounded-xl rounded-tl-none">
                          <Markdown>{item.answer}</Markdown>
                          <span className='block text-[10px]'>{item.answerTime}</span>
                        </div>
                      </li>
                    )}

                    {!item.loading && item.error && (
                      <li className=" flex justify-start mb-2">
                        <div className="bg-white w-[40px] h-[40px] rounded-full flex items-center justify-center text-[#4629f2] font-bold text-xl mr-2 relative after:content-['Assistant'] after:absolute after:left-[45px] after:top-[-20px] after:text-[11px] after:text-white after:font-normal ">
                          <img src={AssistantIcon} alt="Assistant" className='w-7 h-7 rounded-full' />
                        </div>
                        <div className="w-fit bg-[#b91c1c] text-white py-3 px-3 text-[14px] rounded-xl rounded-tl-none">
                          API failed — no data received
                          <span className='block text-[10px]'>{item.askTime}</span>
                        </div>
                      </li>
                    )}

                  </React.Fragment>
                ))
              )}

            </ul>
          </div>
          <form onSubmit={handleAdd}>
            <div className='bg-[#0d082c] absolute  bottom-0 w-full p-5 border-t-1 border-gray-700 flex items-center rounded-b-md'>
              <span className='text-xl'>😊</span> <input
                type="text"
                value={question}
                name=''
                placeholder='Reply...'
                className='w-full p-3 mx-2 rounded-lg border-1 border-[#110b34] bg-[#110b34] text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                onChange={(e) => setQuestion(e.target.value)}
              />
              <button
                className='w-10 h-10 bg-blue-700 flex items-center justify-center rounded-full  text-white font-bold cursor-pointer'
                type='submit'
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>

              </button>
            </div>
          </form>

        </div>

      </div >

    </>
  )
}

export default App
