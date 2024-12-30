"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import {
  useRouter,
  usePathname,
  useSearchParams,
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
  redirect,
  notFound,
} from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Notification from "@/components/notification_popup";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const getCount = async (): Promise<any> => {
  try {
    const res = await axios.get("/api/ment/random", {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    if (res.status === 200) {
      return res.data.ment;
    }
  } catch (err) {
    console.log(err);
    return "";
  }
  return "";
};

const setShare = async (uuid: string): Promise<boolean> => {
  try {
    const res = await axios.put(
      `/api/ment/share`,
      {
        uuid: uuid,
      },
      {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
    if (res.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const setLike = async (uuid: string, kind: string): Promise<boolean> => {
  try {
    const res = await axios.put(
      `/api/ment/like`,
      {
        uuid: uuid,
        kind: kind,
      },
      {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
    if (res.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

export default function Ment() {
  const router = useRouter();
  const [showDiv, setShowDiv] = useState(false);
  const [animation, setAnimation] = useState(true);

  const searchParams = useSearchParams();
  const search = searchParams.get("s");

  const [ment, setMent] = useState("");
  const [mentUuid, setMentUuid] = useState("");

  const [liked, setLiked] = useState(false);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const notificationDuration = 3000;

  const copyLink = (message: string) => {
    navigator.clipboard.writeText("https://new-year.app");
    setNotificationMessage(message);
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, notificationDuration);
  };

  const like = (kind: string) => {
    if (liked) {
      setNotificationMessage("반응은 한 번만 가능해요!");
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, notificationDuration);
    } else {
      setLike(mentUuid, kind);
      setLiked(true);
      setNotificationMessage("덕담에 반응해주셔서 감사해요!");
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, notificationDuration);
    }
  };

  useEffect(() => {
    async function fetchMent() {
      const ment = await getCount();
      if (ment !== "") {
        setShare(ment.uuid);
        setAnimation(false);
        setMent(ment.ment);
        setMentUuid(ment.uuid);
        const timer = setTimeout(() => {
          setShowDiv(true);
        }, 500);
        return () => {
          clearTimeout(timer);
        };
      }
    }
    fetchMent();
  }, []);

  useEffect(() => {
    console.log(search);
  }, [search]);

  return (
    <Suspense>
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
          덕담을 전달 중입니다...
          <br />
          <span
            onClick={() => {
              window.location.href = "/select";
            }}
            style={{ cursor: "pointer", color: "#6f6f6f", fontSize: "0.9rem" }}
          >
            새로고침
          </span>
        </p>
      </div>
      <div className={animation ? styles.blur_background : ""}>
        <div className={styles.main}>
          <div style={{ display: "flex", flexDirection: "row", gap: "1.5rem" }}>
            <Image
              src="/images/pocket.png"
              alt="pocket"
              width={35}
              height={35}
            />
            <h1 className={styles.title}>덕담이 도착했어요</h1>
            <Image
              src="/images/pocket.png"
              alt="pocket"
              width={35}
              height={35}
            />
          </div>
          <div
            className={
              showDiv
                ? [styles.show, styles.fade_div].join(" ")
                : styles.fade_div
            }
          >
            <p className={styles.ment}>{ment}</p>
          </div>
          <div className={styles.share_div}>
            <Link
              target="_blank"
              href={`ment/card?id=${mentUuid}`}
              className={styles.share_button}
              style={{ textDecoration: "none", color: "black" }}
            >
              <Image
                src="/images/picture_icon.png"
                alt="picture"
                width={20}
                height={20}
                style={{ opacity: 0.5, marginRight: "0.5rem" }}
              />
              덕담카드 사진 저장
            </Link>
            <div
              className={styles.share_button}
              onClick={() => copyLink("덕담 주머니 링크가 복사됐어요!")}
            >
              <Image
                src="/images/link_icon.png"
                alt="picture"
                width={20}
                height={20}
                style={{ opacity: 0.5, marginRight: "0.5rem" }}
              />
              덕담주머니 공유
            </div>
          </div>
          <div className={styles.ment_like_div}>
            <p className={styles.ment_like}>덕담이 마음에 드셨나요?</p>
            <div className={styles.ment_like_button_div}>
              <div
                className={[styles.ment_like_icon_div, styles.like_button].join(
                  " "
                )}
                onClick={() => {
                  like("01");
                }}
              >
                🥹 감동이에요
              </div>
              <div
                className={[styles.ment_like_icon_div, styles.like_button].join(
                  " "
                )}
                onClick={() => {
                  like("02");
                }}
              >
                😊 훈훈해요
              </div>
              <div
                className={[styles.ment_like_icon_div, styles.like_button].join(
                  " "
                )}
                onClick={() => {
                  like("03");
                }}
              >
                😑 별로에요
              </div>
            </div>
          </div>
          <div className={styles.next_div}>
            <Link href="/data" className={styles.next_ment}>
              다음으로&nbsp;&rarr;
            </Link>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
