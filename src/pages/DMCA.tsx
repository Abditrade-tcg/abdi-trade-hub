import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle } from "lucide-react";

const DMCA = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-5xl font-bold mb-4">DMCA Policy</h1>
          <p className="text-muted-foreground mb-8">Digital Millennium Copyright Act Compliance</p>

          <Card>
            <CardContent className="p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">Copyright Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  AbdiTrade respects the intellectual property rights of others and expects its users to do the same. 
                  In accordance with the Digital Millennium Copyright Act (DMCA), we will respond expeditiously to claims 
                  of copyright infringement on our platform.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">Notice of Infringement</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement 
                  and is accessible on AbdiTrade, you may notify our Designated Copyright Agent as set forth below.
                </p>
                
                <h3 className="text-xl font-semibold mb-3 mt-6">Required Information</h3>
                <p className="text-muted-foreground mb-4">
                  For your complaint to be valid under the DMCA, you must provide the following information:
                </p>
                <ol className="list-decimal list-inside space-y-3 text-muted-foreground ml-4">
                  <li>
                    <strong>Identification of the copyrighted work:</strong> Describe the copyrighted work that you claim 
                    has been infringed, or if multiple copyrighted works are covered by a single notification, a representative 
                    list of such works.
                  </li>
                  <li>
                    <strong>Identification of the infringing material:</strong> Provide the URL or other specific location 
                    on our platform where the material you claim is infringing is located.
                  </li>
                  <li>
                    <strong>Your contact information:</strong> Include your name, address, telephone number, and email address.
                  </li>
                  <li>
                    <strong>Good faith statement:</strong> A statement that you have a good faith belief that use of the material 
                    in the manner complained of is not authorized by the copyright owner, its agent, or the law.
                  </li>
                  <li>
                    <strong>Accuracy statement:</strong> A statement that the information in the notification is accurate, and 
                    under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is 
                    allegedly infringed.
                  </li>
                  <li>
                    <strong>Physical or electronic signature:</strong> Your physical or electronic signature.
                  </li>
                </ol>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">Designated Copyright Agent</h2>
                <p className="text-muted-foreground mb-4">
                  Send DMCA notices to our Designated Copyright Agent at:
                </p>
                <Card className="bg-secondary/30">
                  <CardContent className="p-6">
                    <p className="font-semibold mb-2">DMCA Agent</p>
                    <p className="text-sm text-muted-foreground">
                      AbdiTrade, Inc.<br />
                      123 Trading Card Ave<br />
                      New York, NY 10001<br />
                      <br />
                      Email: dmca@abditrade.com<br />
                      Phone: 1-800-ABDITRADE<br />
                      Fax: (555) 123-4567
                    </p>
                  </CardContent>
                </Card>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">Our Response to DMCA Notices</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Upon receipt of a valid DMCA notice, we will:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Remove or disable access to the allegedly infringing material</li>
                  <li>Notify the user who posted the material</li>
                  <li>Provide the user with a copy of the DMCA notice</li>
                  <li>Terminate repeat infringers' accounts in appropriate circumstances</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">Counter-Notification</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you believe that your content was removed in error or that you have authorization to use the material, 
                  you may submit a counter-notification containing the following:
                </p>
                <ol className="list-decimal list-inside space-y-3 text-muted-foreground ml-4">
                  <li>Your physical or electronic signature</li>
                  <li>Identification of the material that was removed and its location before removal</li>
                  <li>A statement under penalty of perjury that you have a good faith belief that the material was removed as 
                      a result of mistake or misidentification</li>
                  <li>Your name, address, telephone number, and a statement that you consent to the jurisdiction of the federal 
                      court in your district, or if outside the United States, any judicial district in which AbdiTrade may be found</li>
                  <li>A statement that you will accept service of process from the person who filed the original DMCA notice or 
                      their agent</li>
                </ol>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">Repeat Infringer Policy</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  In accordance with the DMCA and other applicable law, AbdiTrade has adopted a policy of terminating, 
                  in appropriate circumstances, the accounts of users who are deemed to be repeat infringers.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  AbdiTrade may also, in its sole discretion, limit access to the Service and/or terminate the accounts of any 
                  users who infringe any intellectual property rights of others, whether or not there is any repeat infringement.
                </p>
              </section>

              <Separator />

              <section>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Important Notice</h3>
                      <p className="text-sm text-muted-foreground">
                        Filing a false DMCA notice or counter-notification may result in legal liability. Before filing a notice 
                        or counter-notification, you should consider seeking legal advice. We recommend that you consult with an 
                        attorney before taking any action.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">Misrepresentations</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Under Section 512(f) of the DMCA, any person who knowingly materially misrepresents that material or activity 
                  is infringing, or that material or activity was removed or disabled by mistake or misidentification, may be 
                  subject to liability.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">No General Monitoring Obligation</h2>
                <p className="text-muted-foreground leading-relaxed">
                  AbdiTrade has no obligation to monitor user-generated content. However, we reserve the right to review content 
                  for compliance with our Terms of Service and to remove or disable access to any content that violates these terms 
                  or applicable law.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">Questions</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have questions about this DMCA Policy or copyright issues on AbdiTrade, please contact our 
                  Copyright Agent using the contact information provided above.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DMCA;

