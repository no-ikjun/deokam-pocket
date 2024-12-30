"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import localFont from "next/font/local";
import Notification from "@/components/notification_popup";
import { useRouter } from "next/navigation";
import axios from "axios";

const myFont = localFont({
  src: "../fonts/NanumMyeongjo.ttf",
});

export default function Pocket() {
  const [animation, setAnimation] = useState(false);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const notificationDuration = 1000;

  const [writtenMents, setWrittenMents] = useState([]);
  const [receivedMents, setReceivedMents] = useState([]);

  const [pocketType, setPocketType] = useState("");
  const [pocketName, setPocketName] = useState("");

  const router = useRouter();

  const copyLink = () => {
    navigator.clipboard.writeText("https://deokdam.app");
    setNotificationMessage("링크가 복사되었습니다!");
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, notificationDuration);
  };

  useEffect(() => {
    const fetchData = async () => {
      setAnimation(true);
      try {
        const pocket_uuid = localStorage.getItem("pocket_uuid");

        const res = await axios.get(
          `/api/pocket/info?pocket_uuid=${pocket_uuid}`
        );
        console.log(res.data);
        setPocketType(res.data.pocket.type);
        setWrittenMents(res.data.writtenMents);
        setReceivedMents(res.data.receivedMents);
        setPocketName(res.data.pocket.name);
      } catch (error) {
        console.error(error);
      }
      setAnimation(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const pocket_uuid = localStorage.getItem("pocket_uuid");
    if (!pocket_uuid) {
      router.replace("/");
    }
  }, [router]);

  return (
    <>
      <Notification show={showNotification} message={notificationMessage} />
      <div
        style={{ display: `${animation ? "flex" : "none"}` }}
        className={styles.sending_div}
      >
        <Image
          src="/images/kite_icon.png"
          alt="kite"
          width={100}
          height={100}
          className={styles.sending_icon}
        />
        <p className={styles.sending_ment}>
          덕담 주머니 확인 중...
          <br />
          <span
            onClick={() => {
              window.location.href = "/pocket";
            }}
            style={{ cursor: "pointer", color: "#6f6f6f", fontSize: "0.9rem" }}
          >
            새로고침
          </span>
        </p>
      </div>
      <div className={animation ? styles.blur_background : ""}>
        <aside className={styles.sidebar}>
          <div className={styles.profile}>
            <div className={styles.profile_info_div}>
              <Image
                src={
                  pocketType !== ""
                    ? `/images/${pocketType}_icon.svg`
                    : "/images/placeholder.png"
                }
                alt="profile"
                width={120}
                height={120}
                className={styles.profile_img}
              />
              <div className={styles.profile_info}>
                <h3 className={styles.profile_name}>{pocketName}</h3>
                <p className={styles.profile_info}>
                  나의 덕담: {writtenMents.length}개
                </p>
                <p className={styles.profile_info}>
                  받은 덕담: {receivedMents.length}개
                </p>
              </div>
            </div>
            <div className={styles.profile_buttons_div}>
              <button
                className={[styles.profile_btn, myFont.className].join(" ")}
                onClick={() => {
                  copyLink();
                }}
              >
                공유하기
              </button>
              <button
                className={[styles.profile_btn, myFont.className].join(" ")}
                style={{ backgroundColor: "#bdbdbd", borderColor: "#bdbdbd" }}
                onClick={() => {
                  localStorage.removeItem("pocket_uuid");
                  router.replace("/");
                }}
              >
                다른 주머니 만들기
              </button>
            </div>
          </div>
        </aside>

        {/* 오른쪽 스크롤 가능한 콘텐츠 섹션 */}
        <main className={styles.content}>
          <h1 className={styles.title}>내가 보낸 덕담</h1>

          {writtenMents.map((ment: any, i: number) => (
            <div key={i} className={styles.card}>
              <div className={styles.card_header}>
                <Image
                  src={`/images/${pocketType}_icon.svg`}
                  alt="profile"
                  width={30}
                  height={30}
                />
                <p className={styles.ment_highlight}>{ment.ment}</p>
              </div>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <div className={styles.reaction_icon_div}>
                  <div className={styles.ment_like_icon}>
                    🥹&nbsp;&nbsp;
                    {(ment.reactions?.length ?? 0) > 0
                      ? ment.reactions.filter((r: string) => r === "1").length
                      : 0}
                  </div>
                  <div className={styles.ment_like_icon}>
                    😊&nbsp;&nbsp;
                    {(ment.reactions?.length ?? 0) > 0
                      ? ment.reactions.filter((r: string) => r === "2").length
                      : 0}
                  </div>
                  <div className={styles.ment_like_icon}>
                    😑&nbsp;&nbsp;
                    {(ment.reactions?.length ?? 0) > 0
                      ? ment.reactions.filter((r: string) => r === "3").length
                      : 0}
                  </div>
                </div>
                <p className={styles.shared_count}>
                  {ment.shared_count}명에게 전달됨
                </p>
              </div>
              {ment.rements.length > 0 ? (
                <>
                  <p>회답</p>
                  <div>
                    {ment.rements.map((rement: any, j: number) => (
                      <div
                        key={j}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "10px",
                          marginTop: "7px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <Image
                            key={j}
                            src={`/images/profile_${(j % 4) + 1}.png`}
                            alt="profile"
                            width={30}
                            height={30}
                          />
                          <p key={j} className={styles.rement}>
                            {rement.rement}
                          </p>
                        </div>
                        <p className={styles.shared_count}>
                          {rement.pocket_name}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          ))}

          <h1 className={styles.title}>받은 덕담</h1>
          {receivedMents.map((ment: any, i: number) => (
            <div key={i} className={styles.card}>
              <div className={styles.card_header}>
                <Image
                  src={`/images/${ment.writer_type}_icon.svg`}
                  alt="profile"
                  width={30}
                  height={30}
                />
                <p className={styles.ment_highlight}>{ment.ment}</p>
              </div>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <div className={styles.reaction_icon_div}>
                  <div className={styles.ment_like_icon}>
                    🥹&nbsp;&nbsp;
                    {(ment.reactions?.length ?? 0) > 0
                      ? ment.reactions.filter((r: string) => r === "1").length
                      : 0}
                  </div>
                  <div className={styles.ment_like_icon}>
                    😊&nbsp;&nbsp;
                    {(ment.reactions?.length ?? 0) > 0
                      ? ment.reactions.filter((r: string) => r === "2").length
                      : 0}
                  </div>
                  <div className={styles.ment_like_icon}>
                    😑&nbsp;&nbsp;
                    {(ment.reactions?.length ?? 0) > 0
                      ? ment.reactions.filter((r: string) => r === "3").length
                      : 0}
                  </div>
                </div>
              </div>
              {ment.rements.length > 0 ? (
                <>
                  <p>회답</p>
                  <div>
                    {ment.rements.map((rement: any, j: number) => (
                      <div
                        key={j}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "10px",
                          marginTop: "7px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <Image
                            key={j}
                            src={`/images/profile_${(j % 4) + 1}.png`}
                            alt="profile"
                            width={30}
                            height={30}
                          />
                          <p key={j} className={styles.rement}>
                            {rement.rement}
                          </p>
                        </div>
                        <p className={styles.shared_count}>
                          {rement.pocket_name}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          ))}
        </main>
      </div>
    </>
  );
}
