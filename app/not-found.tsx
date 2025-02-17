"use client";
import { Button, Page, Text } from "@geist-ui/core";
import Image from "next/image";
import logo from "@/public/assets/icons/logo.svg";
import { ArrowLeft, Github } from "@geist-ui/icons";
import Link from "next/link";
import empty from "@/public/assets/images/emptyState.svg";

export default function Vulnerabilities() {
  return (
    <Page className="!m-0 !p-0 !w-full">
      <Page.Header className="!sticky">
        <div className="flex justify-between items-center p-4 border border-b-gray-400">
          <div className="flex gap-2 items-center">
            <Image src={logo} alt="logo" height={16} />
            <Text h3 className="!m-0">
              Strike Vulnerabilities Manager
            </Text>
          </div>
          <div className="flex gap-4 items-center">
            <Link
              href="https://github.com/lopez96lau/strike-vulnerabilities-manager"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github color="gray" size={20} />
            </Link>
          </div>
        </div>
      </Page.Header>
      <Page.Content className="!p-0 !h-[calc(100vh-70px)]">
        <div className="flex flex-col p-4 w-full h-full items-center justify-center">
          <Image src={empty} alt="" />
          <Text h3 className="">
            404 - Page not found
          </Text>
          <Link href="/">
            <Button
              auto
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              icon={<ArrowLeft />}
              className="!rounded-full"
            >
              Go to vulnerabilities
            </Button>
          </Link>
        </div>
      </Page.Content>
    </Page>
  );
}
