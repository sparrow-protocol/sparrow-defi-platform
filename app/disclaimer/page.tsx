export default function DisclaimerPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-12 md:py-24 lg:py-32 bg-medium-gray dark:bg-black text-black dark:text-white px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Disclaimer</h1>
      <div className="max-w-3xl text-left text-black/70 dark:text-light-gray space-y-4">
        <p>
          The information provided by Sparrow Protocol on{" "}
          <a href="https://sparrowprotocol.com" className="text-gold hover:underline">
            https://sparrowprotocol.com
          </a>{" "}
          (the "Site") is for general informational purposes only. All information on the Site is provided in good
          faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy,
          adequacy, validity, reliability, availability, or completeness of any information on the Site.
        </p>
        <p>
          UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A
          RESULT OF THE USE OF THE SITE OR RELIANCE ON ANY INFORMATION PROVIDED ON THE SITE. YOUR USE OF THE SITE AND
          YOUR RELIANCE ON ANY INFORMATION ON THE SITE IS SOLELY AT YOUR OWN RISK.
        </p>
        <p>
          <strong>External Links Disclaimer:</strong> The Site may contain (or you may be sent through the Site) links
          to other websites or content belonging to or originating from third parties or links to websites and features
          in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy,
          adequacy, validity, reliability, availability, or completeness by us. WE DO NOT WARRANT, ENDORSE, GUARANTEE,
          OR ASSUME RESPONSIBILITY FOR THE ACCURACY OR RELIABILITY OF ANY INFORMATION OFFERED BY THIRD-PARTY WEBSITES
          LINKED THROUGH THE SITE OR ANY WEBSITE OR FEATURE LINKED IN ANY BANNER OR OTHER ADVERTISING. WE WILL NOT BE A
          PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND THIRD-PARTY PROVIDERS OF
          PRODUCTS OR SERVICES.
        </p>
        <p>
          <strong>Financial Disclaimer:</strong> The Site cannot and does not contain financial advice. The financial
          information is provided for general informational and educational purposes only and is not a substitute for
          professional advice. Accordingly, before taking any actions based upon such information, we encourage you to
          consult with the appropriate professionals. We do not provide any kind of financial advice. THE USE OR
          RELIANCE OF ANY INFORMATION CONTAINED ON THIS SITE IS SOLELY AT YOUR OWN RISK.
        </p>
        <p>
          <strong>Cryptocurrency Risk Disclaimer:</strong> Investing in cryptocurrencies carries a high level of risk,
          and may not be suitable for all investors. Before deciding to invest in cryptocurrency, you should carefully
          consider your investment objectives, level of experience, and risk appetite. The possibility exists that you
          could sustain a loss of some or all of your initial investment and therefore you should not invest money that
          you cannot afford to lose. You should be aware of all the risks associated with cryptocurrency trading, and
          seek advice from an independent financial advisor if you have any doubts.
        </p>
      </div>
    </div>
  )
}
