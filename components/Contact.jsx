"use client";
import { useState } from "react";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";

export default function Contact() {
  const [sent, setSent] = useState(false);

  // TODO: connect this to your email / form service (Formspree, Resend, etc.)
  const submit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className="section contact" id="contact">
      <div className="container contact-grid">
        <Reveal>
          <p className="eyebrow">Contact us</p>
          <h2 className="h2">Say it.<br /><span className="outline">Unfiltered.</span></h2>
          <p className="lead">Questions, collabs, wholesale or an order issue — drop us a line and we'll get back fast.</p>
          <a className="mail" href="https://www.instagram.com/deadstox.in" target="_blank" rel="noopener noreferrer" data-cursor="Instagram">@deadstox.in</a>
        </Reveal>

        <Reveal delay={150}>
          {sent ? (
            <div className="sent">
              <h3>Message received.</h3>
              <p>Thanks — we'll be in touch soon.</p>
            </div>
          ) : (
            <form className="form" onSubmit={submit}>
              <label className="field"><input required name="name" placeholder=" " autoComplete="name" /><span>Your name</span></label>
              <label className="field"><input required type="email" name="email" placeholder=" " autoComplete="email" /><span>Email</span></label>
              <label className="field"><textarea required name="message" rows="4" placeholder=" " /><span>Message</span></label>
              <Magnetic>
                <button type="submit" className="btn btn-primary"><span>Send message</span></button>
              </Magnetic>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
