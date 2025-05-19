
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Slider from "react-slick";
import SignaturePad from "react-signature-canvas";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function DiyaDocuments() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const sigPadRef = useRef();
  const [signatureURL, setSignatureURL] = useState(() => localStorage.getItem("signature") || "");

  useEffect(() => {
    if (id) {
      fetch(`https://rozigrish-diia-pranks-1.onrender.com/?id=${id}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.error) setError(res.error);
          else setData(res);
        })
        .catch(() => setError("Не вдалося завантажити дані"));
    }
  }, [id]);

  const handleClear = () => {
    sigPadRef.current.clear();
    setSignatureURL("");
    localStorage.removeItem("signature");
  };

  const handleSave = () => {
    if (!sigPadRef.current.isEmpty()) {
      const url = sigPadRef.current.getTrimmedCanvas().toDataURL("image/png");
      setSignatureURL(url);
      localStorage.setItem("signature", url);
    }
  };

  if (error) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }

  if (!data) {
    return <div className="p-4 text-center text-gray-500">Завантаження...</div>;
  }

  const Input = (props) => <input className="w-full p-1 border rounded" {...props} />;
  const Label = ({ children }) => <label className="font-semibold block mt-2">{children}</label>;

  const documents = [
    {
      title: "Паспорт громадянина України",
      content: (
        <>
          <Label>ПІБ</Label>
          <Input value={data.name} readOnly />
          <Label>Дата народження</Label>
          <Input value={data.dob} readOnly />
          <Label>Підпис</Label>
          {signatureURL ? (
            <img src={signatureURL} alt="Підпис" className="border p-1 rounded" />
          ) : (
            <>
              <SignaturePad
                ref={sigPadRef}
                canvasProps={{
                  width: 300,
                  height: 100,
                  className: "border rounded bg-white"
                }}
              />
              <div className="flex justify-between mt-2">
                <button onClick={handleClear} className="text-sm text-red-500">Очистити</button>
                <button onClick={handleSave} className="text-sm text-green-600">Зберегти</button>
              </div>
            </>
          )}
        </>
      )
    },
    {
      title: "ІПН (Податковий номер)",
      content: (
        <>
          <Label>ПІБ</Label>
          <Input value={data.name} readOnly />
          <Label>Код</Label>
          <Input value={"1234567890"} readOnly />
        </>
      )
    },
    {
      title: "Студентський квиток",
      content: (
        <>
          <Label>ПІБ</Label>
          <Input value={data.name} readOnly />
          <Label>Навчальний заклад</Label>
          <Input value={"Університет Мемів"} readOnly />
        </>
      )
    },
    {
      title: "COVID-сертифікат",
      content: (
        <>
          <Label>Сертифікат</Label>
          <Input value={"Вакцинований від дурості"} readOnly />
          <Label>Дійсний до</Label>
          <Input value={"12.12.2030"} readOnly />
        </>
      )
    },
    {
      title: "Повістка до Космічних військ",
      content: (
        <>
          <Label>ПІБ</Label>
          <Input value={data.name} readOnly />
          <Label>Частина</Label>
          <Input value={"Орбіта Пельменна, сектор D"} readOnly />
        </>
      )
    },
    {
      title: "Субсидія на пельмені",
      content: (
        <>
          <Label>ПІБ</Label>
          <Input value={data.name} readOnly />
          <Label>Сума</Label>
          <Input value={"₴9999.99"} readOnly />
        </>
      )
    }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#a3d3d3] to-[#c6e2f5] p-4">
      <Slider {...settings}>
        {documents.map((doc, index) => (
          <div key={index}>
            <div className="max-w-md mx-auto p-4 rounded-2xl shadow-xl bg-white">
              <h2 className="text-lg font-semibold mb-2 text-center">{doc.title}</h2>
              <div className="flex flex-col items-center">
                <div className="w-32 h-40 bg-gray-200 rounded mb-2 overflow-hidden">
                  {data.photo ? (
                    <img src={data.photo} alt="Фото" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-center p-2 block">Фото</span>
                  )}
                </div>
              </div>
              <div className="mt-4 space-y-2">{doc.content}</div>
              <div className="mt-4 text-sm text-gray-600 text-center">
                Документ оновлено о {new Date(data.timestamp).toLocaleTimeString()} | {new Date(data.timestamp).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
