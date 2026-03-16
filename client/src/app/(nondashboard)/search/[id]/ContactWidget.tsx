import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/(auth)/authProvider";
import { Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const ContactWidget = ({ onOpenModal, phoneNumber }: ContactWidgetProps) => {
  const { user } = useAuth();
  const router = useRouter();

  const handleButtonClick = () => {
    if (user) {
      onOpenModal();
    } else {
      router.push("/signin");
    }
  };

  return (
    <div className="bg-white border border-primary-200 rounded-2xl p-3 sm:p-5 md:p-7 h-fit w-full md:min-w-[300px]">
      <div className="flex items-center gap-3 sm:gap-5 mb-3 sm:mb-4 border border-primary-200 p-3 sm:p-4 rounded-xl">
        <div className="flex items-center p-3 sm:p-4 bg-primary-900 rounded-full">
          <Phone className="text-primary-50 w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
        <div>
          <p className="text-xs sm:text-sm md:text-base">Contact This Property</p>
          <div className="text-sm sm:text-base md:text-lg font-bold text-primary-800">
            {user ? phoneNumber : "(+91) 89XXXXXXXX"}
          </div>
        </div>
      </div>
      <Button className="w-full bg-primary-700 text-white hover:bg-primary-600 text-xs sm:text-sm md:text-base h-9 sm:h-10" onClick={handleButtonClick}>
        {user ? "Submit Application" : "Sign In to Apply"}
      </Button>
      <hr className="my-3 sm:my-4" />
      <div className="text-xs sm:text-sm">
        <div className="text-primary-600 mb-1">Language: English, Hindi</div>
        <div className="text-primary-600">Open by appointment on Monday - Sunday</div>
      </div>
    </div>
  );
};

export default ContactWidget;
