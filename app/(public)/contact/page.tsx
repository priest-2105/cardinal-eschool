import ContactForm from "@/components/public/pages/contact/ContactForm";
import ContactHero from "@/components/public/pages/contact/ContactHero";


function Contact() {
  return (
        <>
        <div className="min-h-screen bg-[#C9F4F4]">
        <ContactHero/>
        <ContactForm/>
        </div>
         </>
  )
}

export default Contact;
