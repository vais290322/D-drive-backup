import React, { useState } from "react";
import Header from "../componants/Header";
import Footer from "../componants/Footer";
import legalBg from "../assets/v1-footerimage.jpg";
import csr1 from "../assets/csr1.png";
import csrImage1 from "../assets/csr2.png"; // Replace with actual image path
import pdfIcon from "../assets/csrpdf.png"; // Replace with actual image path

const API = import.meta.env.VITE_OLD_API_URL;
export const CSR = () => {
  const references = [
    "Barnard, C. I. (1938). The functions of the executive. Cambridge, MA: Harvard University Press.",
    "Bhaduri, S. N., &Selarka, E. (2016). Corporate Social Responsibility around the World—An Overview of Theoretical Framework, and Evolution. In Corporate governance and corporate social responsibility of Indian companies(pp. 11-32). Springer, Singapore.",
    "Bowen, H.R. (1953). Social responsibilities of the businessman. New York: Harper & Row.",
    "Carroll, A. B. (1999). Corporate social responsibility: Evolution of a definitional construct. Business & society, 38(3), 268-295.",
    "Carroll, A. B. (2008). A history of corporate social responsibility: Concepts and practices. The Oxford handbook of corporate social responsibility, 19-46.",
    "Clark, J. M. (1939). Social Control of Business McGraw-Hill.",
    "Dahlsrud, A. (2008). How corporate social responsibility is defined: an analysis of 37 definitions. Corporate social responsibility and environmental management, 15(1), 1-13.",
    "D’marto, A., Henderson, S., & Florence, S. (2009). Corporate social responsibility and sustainable business. A Guide to Leadership Tasks and Functions, Center For Creative Leadership, Greensboro, North Carolina.",
    "Davis, K. (1960). Can business afford to ignore social responsibilities? California Management Review, 2, 70-76.",
    "DezanShira& Associates (2017). Corporate Social Responsibility in India. India Briefing.",
    "Elkington, J. (2013). Enter the triple bottom line. In The triple bottom line(pp. 23-38). Routledge.",
    "Griffin, J. J., & Mahon, J. F. (1997). The corporate social performance and corporate financial performance debate: Twenty-five years of incomparable research. Business & society, 36(1), 5-31.",
    "Husted, B. W. (2000). A contingency theory of corporate social performance. Business & Society, 39(1), 24-48.",
    "Jones, T. M. (1980). Corporate social responsibility revisited, redefined. California Management Review, 59-67.",
    "Johnson, H. L. (1971). Business in contemporary society: Framework and issues. Belmont, CA: Wadsworth.",
    "Kahneman, D., & Egan, P. (2011). Thinking, fast and slow (Vol.1). New York: Farrar, Straus and Giroux.",
    "Kazim (2013). Corporate social responsibility-Issues and challenges in India. Companion.",
    "MoynaManku (2017). Three years of CSR: Spending on the rise, yet results remain. Livemint.",
    "ParulSoni (2013). Corporate Social Responsibility in India – Potential to contribute towards inclusive social development. An Agenda for Inclusive Growth. PHD Chamber.",
    "Press Trust of India (2017). India Inc’s CSR spend crosses Rs 8,000 crore in two years. Business Standard. (http://www.business-standard.com/article/companies/india-inc-s-csr-spending-crosses-rs-18-600-cr-in-two-years-117020300346_1.html)",
    "RakhiMazumdar (2018). B2B ecommerce co. mjunction puts its next big bet on cloud. The Economic Times.",
    "Report: National Voluntary Guidelines on Socio-Economic and Environmental Responsibilities of Business (2011). Ministry of Corporate Affairs.",
    "Rangan, K., Chase, L. A., &Karim, S. (2012). Why every company needs a CSR strategy and how to build it.",
    "Sangle, S. (2010). Critical success factors for corporate social responsibility: A public sector perspective. Corporate Social Responsibility and Environmental Management, 17(4), 205-214.",
    "Swanson, D. L. (1995). Addressing a theoretical problem by reorienting the corporate social performance model. Academy of Management Review, 20, 43-64.",
    "Tom Burall (2006). The power of accountability: A synthesis of case studies review.",
    "KasturiRangan, Lisa Chase, SohelKarim (2015):The truth about CSR.",
    "World Business Council for Sustainable Development (1997). Corporate Social Responsibility: Meeting changing expectations.",
    "Definition of Corporate Social Responsibility. Financial Times. ((https://www.business-standard.com/search?term=corporate-social-responsibility-(CSR))",
  ];

  const [data, setData] = React.useState([]);
  const [content, setcontent] = useState([]);
  const fetchData = async () => {
    try {
      const response = await fetch(`${API}/api/v1/csr-content`); // Adjust the API endpoint as needed");
      const result = await response.json();
      setData(result.contents);
      console.log("Fetched CSR Data:", result.contents);
    } catch (error) {
      console.error("Error fetching CSR data:", error);
    }
  };

  const fetchcontant = async () => {
    try {
      const response = await fetch(`${API}/api/v1/csr-blog`); // Adjust the API endpoint as needed");
      const result = await response.json();
      setcontent(result.blogs);
      console.log("Fetched CSR Data:", result);
    } catch (error) {
      console.error("Error fetching CSR data:", error);
    }
  };

  React.useEffect(() => {
    fetchData();
    fetchcontant();
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-[49.6vh] bg-white">
        {/* Top Pattern Strip */}
        <div
          className="h-14 bg-no-repeat bg-cover bg-center"
          style={{ backgroundImage: `url(${legalBg})` }}
        ></div>

        {/* Content */}
        <section className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-2xl mb-2">
            Focus on CSR
            <span className="block h-[2px] w-20 bg-[#b2a65f] mt-1 "></span>
          </h2>

          <p className="italic text-sm text-gray-600 mb-6">
            <span className="font-semibold">Focus on CSR: </span>
            <span className="text-gray-700">
              C-DRASTĀ Column on Corporate Social Responsibility
            </span>
          </p>

          {/* Grid Layout */}
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Column 1 – Heading */}
            <div
              className="relative bg-cover bg-center h-40 flex items-center justify-center mt-10"
              style={{ backgroundImage: `url(${csr1})` }}
            >
              <div className="bg-white/80 p-2 rounded">
                <p className="text-gray-800 font-medium text-sm">
                  Corporate Social Responsibility
                </p>
              </div>
            </div>

            {/* Column 2 – Image + Author */}
            <div>
              <img
                src={csrImage1}
                alt="Corporate Social Responsibility"
                className="w-full max-w-xs mx-auto md:mx-0"
              />
            </div>

            {/* Column 3 – Contents Box */}
            <div className="bg-gray-100 h-[200px] w-full">
              <div className="bg-[#8e8350] pt-2.5 pl-2 pb-0.5 w-full">
                <h3 className="font-bold text-sm text-black mb-3 tracking-wide">
                  CONTENTS
                </h3>
              </div>

              <div className="h-64 overflow-y-scroll pr-2">
                <ol className="text-sm text-gray-800 space-y-4 list-decimal list-inside pl-2 pb-2 pt-3">
                  {data.map((item, index) => (
                    <li key={index} className="font-medium">
                      {item.title}
                      <p className="italic text-xs text-gray-600">
                        {item.author}
                      </p>
                      {item.pdfLink && (
                        <a
                          href={item.pdfLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={pdfIcon}
                            alt="PDF Icon"
                            className="w-10 h-10 mt-2"
                          />
                        </a>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="bg-white min-h-screen py-10 px-4 flex justify-center">
        <div className="max-w-7xl w-full text-gray-800 leading-relaxed">
          {/* Author Section */}
          <div className="mb-6">
            <h2 className="font-semibold text-lg">Sreya Debnath</h2>
            <p className="italic text-sm">
              Member, Research Team, C-DRASTA
              <br />
              <span className="text-gray-500">Focus on CSR – WP-2018-01</span>
              <br />
              Accepted:{" "}
              <span className="font-medium">
                27<sup>th</sup> June 2018
              </span>
              <br />
              Posted:{" "}
              <span className="font-medium">
                19<sup>th</sup> July 2018
              </span>
            </p>
          </div>

          {/* Abstract Section */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-2">Abstract</h3>

            <div className="space-y-8 max-w-7xl mx-auto">
              {content.map((item, index) => (
                <article
                  key={index}
                  className="bg-white p-6 "
                >
                  {/* Abstract Section */}
                  <section className="mb-6">
                    <p className="text-gray-700 leading-relaxed">
                      {item.abstract}
                    </p>
                  </section>

                  {/* Main Content Sections */}
                  <div className="space-y-6">
                    {item.details?.map((detail, detailIndex) => (
                      <section
                        key={detailIndex}
                        className="border-t pt-4 first:border-t-0 first:pt-0"
                      >
                        <h3 className="text-lg font-medium text-gray-800 mb-3">
                          {detail.heading}
                        </h3>

                        <div className="text-gray-700 space-y-4">
                          {detail.content
                            .split("\n")
                            .map((paragraph, pIndex) => (
                              <p key={pIndex} className="leading-relaxed">
                                {paragraph}
                              </p>
                            ))}
                        </div>

                        {/* Sub-sections */}
                        {detail.subDetails?.length > 0 && (
                          <div className="mt-4 pl-4 space-y-3">
                            {detail.subDetails.map((subDetail, subIndex) => (
                              <div key={subIndex} className="pt-2">
                                <h4 className="text-md font-medium text-gray-700">
                                  {subDetail.subHeading}
                                </h4>
                                <p className="text-gray-600 mt-1">
                                  {subDetail.subContent}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </section>
                    ))}
                  </div>

                  {/* References Section */}
                  {item.references?.length > 0 && (
                    <section className="mt-8 pt-4 border-t">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        References
                      </h3>
                      <ol className="list-decimal pl-5 space-y-2">
                        {item.references.map((reference, refIndex) => (
                          <li key={refIndex} className="text-gray-700">
                            {reference.title && (
                              <span className="mr-1">{reference.title}</span>
                            )}
                            {reference.link && (
                              <a
                                href={reference.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm break-words"
                              >
                                {reference.link}
                              </a>
                            )}
                          </li>
                        ))}
                      </ol>
                    </section>
                  )}
                </article>
              ))}
            </div>

            {/* <p className="text-justify text-sm">
              Business in standard classical economic sense was always linked
              with profit motive. But, the scenario has changed and corporations
              are now asked to go beyond profit; businesses are now expected to
              be more inclined towards activities leading to community welfare.
              This idea led to the introduction of Corporate Social
              Responsibility (CSR). The main motive behind CSR is to make
              business more welfare generating by inducing companies to take
              actions that counteract the negative externality generated in form
              of natural resource depletion, community disruption and
              environmental degradation. CSR thus acts as a step towards
              attaining national development and sustainability.
            </p>
            <br />
            <p className="text-justify text-sm">
              The Companies Act, 2013 brought about a massive change to
              corporate philanthropy in India. This Bill, passed by Government
              of India includes a clause 135 which proposes that companies with
              net worth of Rs. 500 crores or more, a turnover of Rs. 1000 crores
              or more, and a net profit of Rs. 5 crores or more have to spend 2%
              of their net profits on CSR. Introduction of this bill made it
              mandatory for companies to invest in CSR from 2014.
            </p>
            <br />
            <p className="text-justify text-sm">
              This article gives a brief insight into CSR, its benefits for
              companies, its current scenario in Indian context and also
              companies’ reaction to the above mentioned bill from secondary
              sources.
            </p> */}
          </div>

          {/* Section 1 */}
          {/* <div>
            <h4 className="font-semibold text-lg mb-2">
              1. Conceptualizing CSR
            </h4>
            <p className="text-justify text-sm">
              The idea of Corporate Social Responsibility (CSR) saw its
              beginning since the 1950s. Carroll (1999) pointed out that even
              though CSR has a long drawn history, the concept’s modern era
              starts from 1950’s. The earliest sightings of CSR was in 1930s and
              in 1940s in the writings of Chester Barnard’s (1938){" "}
              <em>‘The Functions of the Executive’</em> and J.M. Clark’s (1939){" "}
              <em>‘Social Control of Business’</em>, which portray business
              communities’ inherent concern for society from that era itself.
            </p>
            <br />
            <p className="text-justify text-sm">
              Bowen (1953) planted the first seed of modern CSR by enquiring
              “What responsibility to society can businessmen reasonably be
              expected to assume?”. He reiterated that social responsibility for
              a businessman is an obligation to pursue those policies, to make
              those decisions and to follow those lines of action which protect
              the objectives and values upheld of our society.
            </p>
            <br />
            <p className="text-justify text-sm">
              Keith Davis (1960) argues that social responsibility is
              “Businessman’s decisions and actions taken for reasons at least
              partially beyond the firm’s direct economic and technical
              interest”. Harold Johnson (1971) in his book{" "}
              <em>‘Business in Contemporary Society: Framework and Issues’</em>{" "}
              introduced features of social responsibility which are apparently
              contradictory but when considered together share a complementarity
              and constitute a comprehensive description of the concept. He
              explained CSR in terms of ‘conventional wisdom’, ‘long run profit
              maximization’ ‘utility maximization’ and ‘lexicographic view of
              social responsibility’.
            </p>
            <br />
            <p className="text-justify text-sm">
              Unlike his predecessors, Jones (1980) emphasized CSR as a process.
              He said CSR should be seen not as an outcome but a process. This
              year also saw the beginning of research on themes closely related
              to CSR such as corporate social responsiveness, corporate social
              performance, public policy, business ethics and stakeholder
              theory/management. Concept of CSR served as the building block or
              point-of-departure for other complementary concepts and themes,
              which continued to grow and take center stage in the 1990s.
            </p>
            <br />
            <p className="text-justify text-sm">
              Initially, the concept of sustainability was attributed only to
              natural environment, but complementing with CSR it evolved into a
              more encompassing concept that embraced the social and stakeholder
              environment. By the start of the 21 century the theoretical flavor
              of CSR research started to change into more empirical oriented
              research and also a shift from research on core CSR concept to
              related topics such as stakeholder theory, business ethics, and
              corporate citizenship. Bryan Husted (2000) brought in a
              contingency theory of CSP which he defined as “…..a function of
              the fit between the nature of the social issue and its
              corresponding strategies and structures” whichled to further
              research on areas such as corporate social responsiveness, issues
              management, and stakeholder management. According to World
              Business Council for Sustainable Development (1999), “Corporate
              Social Responsibility (CSR) is the continuing commitment by
              business to behave ethically and contribute to economic
              development while improving the quality of life of the workforce
              and their families as well as of the local community and society
              at large” (Fernando, 2009).
            </p>
            <br />
            <p className="text-justify text-sm">
              Johnson (1971) elaborated and described the four aspects of social
              responsibility in the following words:
            </p>
            <br />
            <p className="text-justify text-sm">
              Conventional wisdom – “A socially responsible firm is the one
              whose managerial staff balances a multiplicity of interests.
              Instead of striving only for larger profits, a responsible
              enterprise also takes into account employees, suppliers, dealers,
              local communities and the nation.”
            </p>
            <br />
            <p className="text-justify text-sm">
              Long run profit maximization – “Social responsibility states that
              business carry out social programs to add profits to their
              organization.”
            </p>
            <br />
            <p className="text-justify text-sm">
              Utility maximization – “A socially responsible entrepreneur or
              manager is one who has utility function of second type, such that
              he is interested not only in his own well-being but also in that
              of the other members of the enterprise and that of his fellow
              citizens”.
            </p>
            <br />
            <p className="text-justify text-sm">
              Lexicographic view of social responsibility – “Lexicographic
              utility theory suggests that strongly profit motivated firms may
              engage in socially responsible behavior. Once they attain their
              profit targets they act as if social responsibility were an
              important goal- even though it isn’t”.
            </p>
          </div>
          <div className="max-w-7xl mx-auto px-4 py-10 text-[#222] text-[15px] leading-7">
            <h2 className="text-2xl font-semibold mb-6">
              2. Why Companies Should Pursue CSR:
            </h2>

            <p className="mb-4">
              CSR is the process through which we can assess an organization’s
              impact on society and identify their responsibilities. Its
              effectiveness depends on a company’s power to balance financial
              aspects of business with investments in social benefit programs
              leading to development of the marginalized sections of the society
              and environment. In other words, the CSR initiatives should be
              economically sustainable.
            </p>

            <p className="mb-4">
              Following are some of the reasons which may make CSR initiatives
              rewarding for businesses:
            </p>

            <ul className="list-disc pl-6 space-y-3 mb-6">
              <li>
                It helps companies to gain a comparative advantage of attracting
                customers since customers prefer suppliers who do responsible
                business, thus leading to better brand recognition, positive
                business reputation, easier access to capital, increased sales
                and customer loyalty. Thus, leading to more revenue generation.
              </li>
              <li>
                It helps in reducing resource use, waste and emissions thus
                protecting the environment and also saving costs, leading to
                better financial performance. Eco-friendly CSR initiatives like
                switching off lights and equipment when not in use or saving
                water can reduce business risk, improve reputation, and provide
                opportunities for cost savings.
              </li>
              <li>
                CSR increases a company’s ability to attract talented and
                skilled staff, improves the attrition rate of employees due to
                ethical work environment and motivates workers to perform
                efficiently. Thus, overall it increases organizational growth.
              </li>
            </ul>

            <hr className="border-t border-gray-400 my-6 w-full" />

            <div className="text-sm mb-6 space-y-2">
              <p>
                [1] Johnson (1971) elaborated and described the four aspects of
                social responsibility in the following words:
              </p>
              <p>
                <em>Conventional wisdom –</em> “A socially responsible firm is
                the one whose managerial staff balances a multiplicity of
                interests. Instead of striving only for larger profits, a
                responsible enterprise also takes into account employees,
                suppliers, dealers, local communities and the nation.”
              </p>
              <p>
                <em>Long run profit maximization –</em> “Social responsibility
                states that businesses carry out social programs to add profits
                to their organization.”
              </p>
              <p>
                <em>Utility maximization –</em> “A socially responsible
                entrepreneur or manager is one who has utility function of
                second type, such that he is interested not only in his own
                well-being but also in that of the other members of the
                enterprise and that of his fellow citizens.”
              </p>
              <p>
                <em>Lexicographic view of social responsibility –</em>{" "}
                “Lexicographic utility theory suggests that strongly profit
                motivated firms may engage in socially responsible behavior.
                Once they attain their profit targets they act as if social
                responsibility were an important goal—even though it isn’t.”
              </p>
            </div>

            <ul className="list-disc pl-6 space-y-3 mb-6">
              <li>
                It leads to ethical business practices which focus on protecting
                workers’ rights throughout the supply chain by ensuring the
                company and their suppliers treat workers fairly. It often
                implies worker welfare, natural resource conservation and
                sustainability.
              </li>
              <li>
                It encourages companies to participate in local community
                development acts through charities which in turn positively
                affect the commercial side of the business by increasing
                endorsements and making business seem more humane. Like
                restaurants providing food to local homeless groups.
              </li>
            </ul>

            <p className="mb-2">
              Companies can engage in CSR activities in two ways –
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                By performing instrumental activities (i.e., increasing
                shareholder value).
              </li>
              <li>
                By following the ethical route because it is the right thing to
                do.
              </li>
            </ul>
          </div>
          <div className="max-w-7xl mx-auto px-4 py-10 text-[#222] text-[15px] leading-7">
            <h2 className="text-2xl font-semibold mb-6">
              3. Effective Business Model Creation to Promote CSR:
            </h2>

            <p className="mb-4">
              To understand the best way for crafting CSR programmes that
              reflects a company’s financial status as well as addresses
              societal, humanitarian and environmental challenges, Rangan K.,
              Lisa A. Chase, S. Karim (2012) introduced the concept of “three
              theatres” to explain proper implementation of CSR activities in
              business. CSR programmes may be classified into ‘three theatres,’
              depending on the nature of CSR activities.
            </p>

            <div className="space-y-6">
              <p>
                <strong>Theatre 1:</strong> Philanthropic giving consists of
                intrinsic activities, i.e., activities that are primarily
                induced by charitable instincts, but with potential business
                benefits. This may be in the form of direct funding to nonprofit
                and community service organizations, employee community service
                projects, or in kind donations of products and services to
                nonprofits and underserved populations. Philanthropic funding is
                provided directly or through corporate foundations that exist
                separately from the corporate entity. In some cases a
                philanthropic campaign may be introduced by corporation to
                restore its corporate image after being sanctioned or penalized
                for ethical or regulatory violations. These CSR initiatives are
                undertaken for reasons very loosely connected to its business
                strategy and may be either proactive or reactive. While in
                proactive instances the reasons are more directly linked to the
                values and purpose of the people in the organization, in the
                reactive cases the principal motivation is to neutralise the
                ‘protesting voices’.
              </p>

              <p>
                <strong>Theatre 2:</strong> Reengineering the value chain
                represents CSR activities that are intended to benefit the
                company’s bottom line, as well as the environmental or social
                impacts of one or more of their value chain partners, including
                the supply chain, distribution channels, or production
                operations. Initiatives in this CSR theatre are usually managed
                or co-managed by an operational manager on the supply side or a
                marketing manager on the demand side of the value chain,
                reflecting the focus on enhancing operational efficiency and/or
                building revenue. Unlike philanthropic CSR programs, CSR
                enterprises in the second theatre have the potential for much
                more extensive social and environmental benefits than programs
                in the first theatre, since they are implemented throughout the
                company’s value chain.
              </p>

              <p>
                <strong>Theatre 3:</strong> Transforming the ecosystem involves
                programs that are aimed at fundamentally changing the
                corporation’s business model. In this third theatre, the company
                attempts to create value to society by (a) addressing a critical
                social or environmental need that is within its business reach,
                but that may not return immediate business profits; (b)
                designing global solutions to environmental and social threats,
                including climate change, health degradation and biodiversity
                loss, global hunger and poverty; and (c) ensuring collaboration
                between corporate, governmental and NGO interests to solve these
                issues. Unlike CSR in the second theatre, efforts in this
                theatre require strategic risk-taking and a focus on long-term
                economic gains. Therefore, third theatre CSR is most effectively
                undertaken by companies who have strong leadership, necessary
                scale, diversified product lines and significant financial
                resources to absorb the uncertainties of a delayed financial
                payoff.
              </p>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 py-10 text-[#222] text-[15px] leading-7">
            <h2 className="text-2xl font-semibold mb-4">
              4. Corporate Social Responsibility in India
            </h2>

            <h3 className="italic font-semibold mb-4">
              4.1. From Paternalistic Philanthropy to CSR:
            </h3>

            <p className="mb-4">
              India has a long tradition of ‘paternalistic philanthropy’ wherein
              Kautilya from India promoted ethical principles while doing
              business. The concept of helping the poor and disadvantaged was
              cited in several ancient literatures. Philanthropy, religion and
              charity were the key drivers of CSR before industrialization as
              the industrial families then had a inclination towards charity and
              other social works but these activities were purely done on the
              basis of personal savings which wasn’t directly business related.
              Most of their work included establishing temples, schools, higher
              education institutions and other infrastructure of public use.
            </p>

            <p className="mb-4">
              CSR gives us insight into corporate altruism or organizations’
              social welfare at one hand and on the other hand it acts as a
              means to reach long term sustainability and community development.
              CSR brings about changes in cultural norms of corporations, i.e.,
              a move towards ethical business. It encourages corporate and
              businessmen to positively impact community, culture, environment,
              women empowerment and other developmental programs through their
              business by following a triple bottom line strategy.<sup>[1]</sup>
            </p>

            <p className="mb-4">
              CSR has rapidly evolved in India with some companies focusing on
              strategic CSR initiatives to contribute toward nation building.
              The best way to implement CSR strategically is to involve the
              employees in the decision making process on how to support
              charities and communities. If the company supports causes that are
              important to employees, this will encourage the loyalty and
              participation of employees and this, in turn, can increase the
              productivity of the workforce. For example, a medical supplies
              company uses its CSR budget for supporting nurses and doctors in
              their training and research as it is nurses and doctors who in
              future are responsible for selecting suppliers for their hospitals
              and other health facilities they work in. If they have benefitted
              from the company’s funding as trainees, they may be loyal to the
              company for all of their working lives.
            </p>

            <p className="mb-4">
              Gradually, the companies in India have started focusing on
              need-based initiatives aligned with the national priorities such
              as public health, education, livelihoods, water conservation and
              natural resource management. The focus is on making companies
              pursue social and development issues not only as their
              responsibility towards society but instead using their business as
              the means to reach towards social development and sustainability.
            </p>

            <p className="mb-4">
              National Voluntary Guidelines on Social, Environmental and
              Economic Responsibility of Business (2011) by Ministry of
              Corporate Affairs in India reports nine principles of National
              Voluntary Guidelines. It points out how companies can improve
              their CSR efforts, i.e., the goal of reaching sustainability
              through business. It is designed with the intent of assisting
              enterprises to become responsible entities by taking into
              consideration the interests and welfare of their stakeholders and
              society at large while earning profits. The principles are:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Principle 1:</strong> Businesses should conduct and
                govern themselves with ethics, transparency and accountability.
              </li>
              <li>
                <strong>Principle 2:</strong> Businesses should provide goods
                and services that are safe and contribute to sustainability
                throughout their life cycle.
              </li>
              <li>
                <strong>Principle 3:</strong> Businesses should promote the
                wellbeing of all employees.
              </li>
              <li>
                <strong>Principle 4:</strong> Businesses should respect the
                interests of and be responsive toward all stakeholders,
                especially those who are disadvantaged, vulnerable and
                marginalized.
              </li>
              <li>
                <strong>Principle 5:</strong> Businesses should respect and
                promote human rights.
              </li>
              <li>
                <strong>Principle 6:</strong> Businesses should respect, protect
                and make efforts to restore the environment.
              </li>
              <li>
                <strong>Principle 7:</strong> Businesses, when engaged in
                influencing public and regulatory policy, should do so in a
                responsible manner.
              </li>
              <li>
                <strong>Principle 8:</strong> Businesses should support
                inclusive growth and equitable development.
              </li>
              <li>
                <strong>Principle 9:</strong> Businesses should engage with and
                provide value to their customers and consumers in a responsible
                manner.
              </li>
            </ul>
            <div className="max-w-7xl mx-auto px-4 py-10 text-[#222] text-[15px] leading-7">
              <h3 className="italic font-semibold mb-4">
                4.2. Changing CSR Policy Environment – From Philanthropy to
                Compliance:
              </h3>

              <p className="mb-4">
                India is the first country in the world to make{" "}
                <strong>corporate social responsibility</strong> (CSR)
                mandatory, following an amendment to The Companies Act, 2013 in
                April 2014. Businesses can invest their profits in areas such as
                education, poverty, gender equality and hunger.
              </p>

              <p className="mb-4 font-semibold text-gray-800">
                According to Section 135 of the proposed Companies Bill, 2012,
                <br />“
                <em>
                  Every Company with a net worth of Rs. 500 crore or more, will
                  have to form a CSR committee [consisting of three or more
                  directors, of which at least one would be an independent
                  director]. This committee will have to ensure that the
                  Companies spends, in every financial year, at least two per
                  cent of the average net profits made during the three
                  immediately preceding years, towards CSR activities. The bill
                  also makes it compulsory for the Companies to specify reasons
                  if it fails to spend the amount.
                </em>
                ”
              </p>

              <p className="mb-4">
                In other words, Schedule VII of the Companies Act advocates that
                those companies with a net worth of US$73 million (Rs 4.96
                billion) or more, or an annual turnover of US$146 million (Rs
                9.92 billion) or more, or a net profit of US$732,654 (Rs 50
                million) or more during a financial year should spend 2% of
                their net profits earn on CSR.
              </p>

              <p className="mb-4">
                <strong>[1]</strong> The Triple Bottom Line is a concept that
                encourages the assessment of overall business performance based
                on three important areas: Profit, People and Planet. It aims to
                measure the financial, social and environmental performance of a
                business over a period of time. It was introduced by Elkington
                (Elkington, 2013)
              </p>

              <hr className="my-6 border-t" />

              <p className="mb-4">
                The main motive behind the introduction of this clause was to
                encourage companies both private and public to implement
                need–based CSR activities. This bill was made mandatory from
                2014 onwards. The Companies Act has simply moved CSR in India
                from Choice to Compliance.
              </p>

              <h4 className="font-medium mb-2">
                Other Government initiatives taken to promote CSR:
              </h4>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>
                  Guidelines on Corporate Social Responsibility and
                  Sustainability for Central Public Sector Enterprises
                </li>
                <li>
                  The National Voluntary Guidelines on Social, Environmental and
                  Economical Responsibilities of Business by the Ministry of
                  Corporate Affairs
                </li>
                <li>
                  SEBI’s mandates an annual business responsibility report for
                  Companies
                </li>
              </ul>

              <p className="mb-4">
                Since for all companies CSR spending/activities have been made
                mandatory so companies have taken to innovation. So strategic
                CSR becomes critical as it tends to both maintain/increase
                shareholder value and do good at the same time. Kahneman and
                Egan (2011) in his book <em>‘Thinking, Fast and Slow’</em>{" "}
                compares behavior of corporations to behavior of human and comes
                to the conclusion they are very much alike. He states that
                “……common human tendency to rely too heavily on the first piece
                of information offered (the “anchor”) when making decisions.”
                Following his line of thought it was assumed that implementation
                of the law in 2012 can give birth to two outcomes –
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The mandatory minimum spending of 2% due to CSR may curtail
                  the corporations own choice of spending on CSR as this 2%
                  limit will act as an “anchor” in their decision making.
                </li>
                <li>
                  Another mechanism that can also work is recalibration.
                  Companies look at studies and collect feedback on others
                  spending and hence will recalibrate, that is, if they are
                  spending less, they are likely to increase their CSR spends.
                  Similarly if they are spending more, they are likely to reduce
                  their CSR spending.
                </li>
              </ul>
            </div>
            <div className="max-w-7xl mx-auto px-4 py-10 text-[#222] text-[15px] leading-7">
              <h3 className="italic font-semibold mb-4">
                4.3. Corporate Social Responsibility: Indian Examples
              </h3>

              <p className="mb-6">
                Indian Corporate’s experiment and experience with CSR
                initiatives has been a mixture of success and failure, with the
                latter serving as paving stones for the future direction of CSR
                projects.
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-gray-800">Tata Group</h4>
                  <p>
                    The <strong>Tata Group</strong> conglomerate in India
                    carries out various CSR projects, mostly community
                    improvement and poverty alleviation programs. It is engaged
                    in women empowerment activities, income generation, rural
                    community development and other social welfare programs
                    through self-help groups. In the field of education, the
                    Tata Group provides scholarships and endowments for numerous
                    institutions. The group also engages in healthcare projects
                    such as facilitation of child education, immunization and
                    creation of awareness of AIDS
                    <em> (DezanShira & Associates, 2017)</em>.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800">Ultratech Cement</h4>
                  <p>
                    <strong>Ultratech Cement</strong>, India’s biggest cement
                    company is involved in social work across 407 villages in
                    the country aiming to create sustainability and
                    self-reliance. Its CSR activities focus on healthcare and
                    family welfare programs, education, infrastructure,
                    environment, social welfare and sustainable livelihood. The
                    company has organized medical camps, immunization programs,
                    sanitization programs, school enrollment, plantation drives,
                    water conservation programs, industrial training and organic
                    farming programs
                    <em> (DezanShira & Associates, 2017)</em>.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800">Unilever</h4>
                  <p>
                    A multinational corporation in the food and beverage sector,
                    it had taken up a comprehensive CSR strategy in the form of
                    the ‘sustainable tea’ programme. On a partnership-based
                    model with the Rainforest Alliance (an NGO), Unilever aimed
                    to source all of its Lipton and PG Tips tea bags from
                    Rainforest Alliance Certified™ farms by 2015. The Rainforest
                    Alliance Certification offered farms a way to differentiate
                    their products as being socially, economically and
                    environmentally sustainable. It aimed towards environmental
                    sustainability
                    <em> (Sangle, 2010)</em>. In words of Paul Polman, CEO of
                    Unilever: “My personal mission is to galvanize our company
                    to be an effective force for good.” Despite Polman’s efforts
                    to make Unilever a good corporate citizen, last year
                    Unilever settled with almost 600 workers in India over
                    mercury exposure from a now-closed thermometer plant
                    following a 2006 lawsuit over exposure to the toxic element
                    <em> (Borelli, 2017)</em>.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800">
                    Mjunction Services Limited
                  </h4>
                  <p>
                    It is India’s largest B2B e-commerce company and also a
                    joint venture between TATA Steel and SAIL. It has launched
                    two flagship programmes ‘School Integration Program’ and
                    ‘English Lab’ in the remote villages of West Bengal.
                    VinayaVarma, CEO of Mjunction proclaimed that, “The employee
                    volunteering model that we follow is a unique way of every
                    employee giving back to society,”
                    <em> (Mazumdar, 2018)</em>.
                  </p>
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 py-10 text-[#222] text-[15px] leading-7">
              <h3 className="italic font-semibold mb-4">
                4.4. CSR Spending Trends in India:
              </h3>

              <p className="mb-4">
                As compared to financial year 2014–2015, financial year 2015–16
                witnessed a 28 percent growth in CSR spending. Companies in
                India spent US$1.23 billion (Rs 83.45 billion) in various
                programs ranging from educational programs, skill development,
                social welfare, healthcare and environment conservation.
              </p>

              <p className="mb-4">
                The education sector received the maximum funding of US$300
                million (Rs 20.42 billion) followed by healthcare at US$240.88
                million (Rs 16.38 billion), while programs such as child
                mortality, maternal health, gender equality and social projects
                saw very little change.
              </p>

              <p className="mb-4">
                In terms of absolute spending, Reliance Industries spent the
                most followed by the government-owned National Thermal Power
                Corporation (NTPC) and Oil & Natural Gas (ONGC). Projects
                implemented through foundations have gone up from 99 in
                Financial Year 2015 to 153 in Financial Year 2016, with an
                increasing number of companies setting up their own foundations
                rather than working with existing non-profits to have more
                control over their CSR spending.
              </p>

              <p className="mb-4">
                The year 2017 brought in more improvement in CSR spending
                because corporate firms started aligning initiatives with new
                government programs such as Swachh Bharat (Clean India) and
                Digital India, in addition to education and healthcare, to
                foster inclusive growth.
                <em> (DezanShira & Associates, 2017)</em>
              </p>

              <p>
                Organizations in India have taken up program-based approaches
                based on social benefits and aligned them with their growing
                business. Companies now have specific departments and teams that
                develop specific policies, strategies and goals for their CSR
                programs and set separate budgets to support them. Though slow,
                CSR initiatives have started to take form among several
                companies. More work is still needed to make their
                implementation and understanding smoother.
              </p>
            </div>
            <div className="max-w-7xl mx-auto px-4 py-10 text-[#222] text-[15px] leading-7">
              <h3 className="italic font-semibold mb-4">4.5. Way Ahead</h3>

              <p className="mb-4">
                Theory says that CSR is definitely the right step towards
                ensuring both business and <strong>society's</strong> social
                welfare. Currently, government is trying to encourage companies
                to develop more sustainable practices and increased
                participation in socially inclusive and welfare enhancing
                directions. However, there are several hurdles that arise when
                one moves from the realm of theory to practical implementation.
              </p>

              <p className="mb-4">
                Government has made CSR spending mandatory from 2014. The CSR
                Rule requires that{" "}
                <em>
                  "Companies with a net worth of Rs. 500 crores, a revenue of
                  Rs. 1,000 crores or a net profit of Rs. 5 crores spend 2% of
                  their average profit on social development activities like
                  education and women’s empowerment. The money can be spent by
                  setting up a CSR department within the company, a corporate
                  foundation or by partnering with not-for-profits."
                </em>
              </p>

              <p className="mb-4">
                We do observe a rise in annual spending on CSR during the three
                years since its implementation, but the problem lies in the
                effective deployment of these funds (Manku, 2017). In support of
                his view, Manku cites experiences and feedback from corporate
                leaders. Priya Naik, founder and CEO of CSR consultancy Samhita,
                mentions that although CSR spending is increasing, there is a
                disconnect in how funds are deployed. There appears to be
                uncertainty in the use of funds, and projects like toilet
                construction may miss the goal of sustainable usage and
                community need.
              </p>

              <p className="mb-4">
                Sonali Pradhan (Julius Baer) highlights that companies often
                focus on areas offering visible, measurable impact and avoid
                less tangible but critical needs. A collaboration gap between
                corporates and NGOs is also noted. Sanjay Daswani (Habitat for
                Humanity) notes that corporates often feel disconnected from
                strategic long-term support, especially if not explicitly
                defined in CSR rules.
              </p>

              <p className="mb-4">
                Kazim (2013) adds that CSR initiatives have not reached
                grassroots levels. Public awareness, lack of media involvement,
                and vague policy understanding further complicate CSR
                effectiveness. This raises essential questions about CSR’s real
                impact—whether it’s better to collaborate with NGOs or manage
                activities internally and whether the public perceives CSR as
                genuine impact or just a checkbox exercise.
              </p>

              <p className="mb-4">
                CSR reflects the oxymoron of 'philanthropy in business.'
                According to Kazim (2013), employees are shifting away from
                salary-focused choices to mission-driven employers. Consumers
                increasingly consider ethics when making purchasing decisions.
                Studies by Environics and the Prince of Wales Business Leaders
                Forum (1999) confirm that ethical values influence corporate
                performance.
              </p>

              <p className="mb-4">
                This gives rise to key questions: Is transparency of CSR
                initiatives enough? How are funds aligned with real needs? Are
                policies in place to ensure meaningful CSR? Is there sufficient
                feedback from the ground level? Are local communities truly
                being served?
              </p>

              <p>
                Thus, CSR promotion needs a lot of work for its proper
                institutionalisation. Governments, social activists, non-profits
                and corporates must collaborate at both policy and grassroots
                levels to implement meaningful CSR for sustainable social
                welfare.
              </p>
            </div>
            <div className="max-w-7xl mx-auto py-10 px-4 text-[15px]">
              <h3 className="text-xl font-semibold mb-6">References:</h3>
              <ul className="list-decimal ml-6 space-y-2">
                {references.map((ref, idx) => (
                  <li key={idx}>
                    {ref.startsWith("http") ? (
                      <a
                        href={ref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {ref}
                      </a>
                    ) : (
                      <span>{ref}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div> */}
        </div>
      </div>
      <Footer />
    </>
  );
};
