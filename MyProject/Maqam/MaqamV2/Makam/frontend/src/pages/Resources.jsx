import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Book, 
  CheckSquare, 
  HelpCircle, 
  FileText, 
  Plane, 
  MapPin, 
  Calendar, 
  Shield,
  Heart,
  Luggage,
  AlertCircle,
  Clock,
  Users,
  Phone,
  Wallet,
  Sun,
  Moon
} from 'lucide-react';

export default function Resources() {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl xl:text-5xl font-bold mb-4">Travel Resources & Guides</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive guides and essential information for your sacred journey to Makkah and Madinah
          </p>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Book className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Hajj Guide</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Complete step-by-step guide for performing Hajj rituals and preparations</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Book className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Umrah Guide</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Detailed instructions for performing Umrah pilgrimage throughout the year</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Visa Guide</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Requirements and procedures for obtaining Saudi Arabia visa</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CheckSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Packing List</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Essential items and recommended supplies for your journey</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="hajj" className="mb-12">
          <TabsList className="grid w-full grid-cols-2 xl:grid-cols-5 mb-8">
            <TabsTrigger value="hajj">Hajj Guide</TabsTrigger>
            <TabsTrigger value="umrah">Umrah Guide</TabsTrigger>
            <TabsTrigger value="visa">Visa Process</TabsTrigger>
            <TabsTrigger value="packing">Packing List</TabsTrigger>
            <TabsTrigger value="tips">Travel Tips</TabsTrigger>
          </TabsList>

          {/* Hajj Guide Tab */}
          <TabsContent value="hajj" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-6 w-6 text-primary" />
                  Complete Hajj Guide
                </CardTitle>
                <CardDescription>
                  Hajj is one of the five pillars of Islam and must be performed at least once in a lifetime by every able-bodied Muslim who can afford it.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Hajj Overview */}
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    When is Hajj?
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Hajj takes place during the Islamic month of Dhul Hijjah, specifically from the 8th to the 12th or 13th day. The dates vary each year according to the Islamic lunar calendar.
                  </p>
                  <Badge variant="secondary">Duration: 5-6 days</Badge>
                  <Badge variant="secondary" className="ml-2">Annual Event</Badge>
                </div>

                {/* Prerequisites */}
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Prerequisites for Hajj
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span><strong>Muslim:</strong> Must be a practicing Muslim</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span><strong>Adult:</strong> Must have reached the age of puberty</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span><strong>Sane:</strong> Must be of sound mind</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span><strong>Physically Able:</strong> Must be in good health and physically capable</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span><strong>Financially Able:</strong> Must have sufficient funds without causing hardship to family</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span><strong>Safe Route:</strong> The journey must be safe and secure</span>
                    </li>
                  </ul>
                </div>

                {/* Hajj Steps */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Step-by-Step Hajj Rituals
                  </h3>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="day1">
                      <AccordionTrigger className="text-lg font-semibold">
                        Day 1 (8th Dhul Hijjah) - Entering Ihram & Mina
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-primary">1. Entering Ihram</h4>
                          <ul className="space-y-1 text-muted-foreground ml-4">
                            <li>• Perform Ghusl (ritual bath) before entering Ihram</li>
                            <li>• Men wear two white unstitched cloths; women wear modest clothing</li>
                            <li>• Make intention (Niyyah) for Hajj</li>
                            <li>• Recite Talbiyah: "Labbayka Allahumma Labbayk..."</li>
                            <li>• Avoid prohibited acts: perfume, cutting hair/nails, intimate relations</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-primary">2. Traveling to Mina</h4>
                          <ul className="space-y-1 text-muted-foreground ml-4">
                            <li>• Travel to Mina after Fajr prayer</li>
                            <li>• Spend the day and night in Mina</li>
                            <li>• Perform five prayers, Asr, Maghrib, Isha, and Fajr</li>
                            <li>• Engage in worship, Quran recitation, and remembrance of Allah</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="day2">
                      <AccordionTrigger className="text-lg font-semibold">
                        Day 2 (9th Dhul Hijjah) - Day of Arafah
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-4">
                        <div className="bg-primary/5 p-4 rounded-lg mb-3">
                          <p className="font-semibold text-primary mb-1">Most Important Day of Hajj</p>
                          <p className="text-sm text-muted-foreground">The Prophet (peace be upon him) said: "Hajj is Arafah"</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-primary">1. Journey to Arafah</h4>
                          <ul className="space-y-1 text-muted-foreground ml-4">
                            <li>• Leave Mina after Fajr prayer</li>
                            <li>• Travel to the Plain of Arafah</li>
                            <li>• Arrive before Dhuhr time</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-primary">2. Standing at Arafah (Wuquf)</h4>
                          <ul className="space-y-1 text-muted-foreground ml-4">
                            <li>• Stand in Arafah from noon until sunset</li>
                            <li>• Combine and shorten Dhuhr and Asr prayers</li>
                            <li>• Engage in sincere supplication (Dua)</li>
                            <li>• Seek forgiveness and mercy from Allah</li>
                            <li>• This is the most crucial pillar of Hajj</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-primary">3. Departure to Muzdalifah</h4>
                          <ul className="space-y-1 text-muted-foreground ml-4">
                            <li>• Leave Arafah after sunset with calmness</li>
                            <li>• Travel to Muzdalifah</li>
                            <li>• Pray Maghrib and Isha combined upon arrival</li>
                            <li>• Collect 49-70 pebbles for stoning ritual</li>
                            <li>• Spend the night under the open sky</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="day3">
                      <AccordionTrigger className="text-lg font-semibold">
                        Day 3 (10th Dhul Hijjah) - Eid al-Adha
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-4">
                        <div className="bg-primary/5 p-4 rounded-lg mb-3">
                          <p className="font-semibold text-primary mb-1">Day of Sacrifice</p>
                          <p className="text-sm text-muted-foreground">Perform four major rituals in order</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-primary">1. Stoning of Jamarat al-Aqaba</h4>
                          <ul className="space-y-1 text-muted-foreground ml-4">
                            <li>• Leave Muzdalifah after Fajr</li>
                            <li>• Go to Mina</li>
                            <li>• Stone the largest pillar (Jamarat al-Aqaba) with 7 pebbles</li>
                            <li>• Say "Allahu Akbar" with each throw</li>
                            <li>• Time: After sunrise until sunset</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-primary">2. Animal Sacrifice (Qurbani)</h4>
                          <ul className="space-y-1 text-muted-foreground ml-4">
                            <li>• Offer animal sacrifice (sheep, goat, cow, or camel)</li>
                            <li>• Can be done personally or through authorized agents</li>
                            <li>• Meat distributed to the poor and needy</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-primary">3. Shaving or Trimming Hair (Halq/Taqsir)</h4>
                          <ul className="space-y-1 text-muted-foreground ml-4">
                            <li>• Men: Shave head completely (preferred) or trim hair</li>
                            <li>• Women: Cut a fingertip's length from hair</li>
                            <li>• After this, most Ihram restrictions are lifted</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-primary">4. Tawaf al-Ifadah & Sa'i</h4>
                          <ul className="space-y-1 text-muted-foreground ml-4">
                            <li>• Travel to Makkah</li>
                            <li>• Perform Tawaf (7 circuits around Kaaba)</li>
                            <li>• Pray 2 rakats at Maqam Ibrahim</li>
                            <li>• Perform Sa'i (7 laps between Safa and Marwah)</li>
                            <li>• Return to Mina for the night</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="day4-5">
                      <AccordionTrigger className="text-lg font-semibold">
                        Days 4-5 (11th-12th Dhul Hijjah) - Days of Tashreeq
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-primary">Stoning All Three Pillars</h4>
                          <ul className="space-y-1 text-muted-foreground ml-4">
                            <li>• Stone all three pillars (Jamarat) each day</li>
                            <li>• Start with the smallest, then middle, then largest</li>
                            <li>• Throw 7 pebbles at each pillar (21 total per day)</li>
                            <li>• Time: After Dhuhr until before Fajr</li>
                            <li>• Make Dua after first two pillars</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-primary">Option to Leave Early</h4>
                          <ul className="space-y-1 text-muted-foreground ml-4">
                            <li>• Can leave Mina on 12th after stoning (before sunset)</li>
                            <li>• Or stay until 13th and stone again (more rewarding)</li>
                            <li>• Must leave before sunset if departing on 12th</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="farewell">
                      <AccordionTrigger className="text-lg font-semibold">
                        Final Day - Farewell Tawaf
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-primary">Tawaf al-Wada (Farewell Tawaf)</h4>
                          <ul className="space-y-1 text-muted-foreground ml-4">
                            <li>• Perform before leaving Makkah</li>
                            <li>• Make 7 circuits around the Kaaba</li>
                            <li>• This is the last ritual of Hajj</li>
                            <li>• Pray 2 rakats at Maqam Ibrahim</li>
                            <li>• Make final supplications</li>
                            <li>• Drink Zamzam water</li>
                          </ul>
                        </div>
                        <div className="bg-primary/5 p-4 rounded-lg">
                          <p className="font-semibold text-primary mb-1">Congratulations!</p>
                          <p className="text-sm text-muted-foreground">You have completed Hajj. May Allah accept your pilgrimage.</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                {/* Important Notes */}
                <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-900">
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    Important Notes
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                    <li>• Stay hydrated and protect yourself from the sun</li>
                    <li>• Be patient and kind to fellow pilgrims</li>
                    <li>• Follow instructions from Hajj authorities</li>
                    <li>• Keep emergency contacts and documents safe</li>
                    <li>• Maintain cleanliness and avoid littering</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Umrah Guide Tab */}
          <TabsContent value="umrah" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-6 w-6 text-primary" />
                  Complete Umrah Guide
                </CardTitle>
                <CardDescription>
                  Umrah is a pilgrimage to Makkah that can be performed at any time of the year. While not obligatory, it is highly recommended.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Umrah Overview */}
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    When Can You Perform Umrah?
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Umrah can be performed at any time throughout the year, except during the days of Hajj (8th-13th Dhul Hijjah). The entire ritual typically takes 3-6 hours.
                  </p>
                  <Badge variant="secondary">Year-Round</Badge>
                  <Badge variant="secondary" className="ml-2">Duration: 3-6 hours</Badge>
                  <Badge variant="secondary" className="ml-2">Flexible Timing</Badge>
                </div>

                {/* Umrah Steps */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Step-by-Step Umrah Rituals
                  </h3>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="ihram">
                      <AccordionTrigger className="text-lg font-semibold">
                        Step 1: Entering Ihram
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-primary">Preparation</h4>
                          <ul className="space-y-1 text-muted-foreground ml-4">
                            <li>• Perform Ghusl (ritual bath) before Miqat</li>
                            <li>• Apply perfume to body (not to Ihram clothes)</li>
                            <li>• Men: Wear two white unstitched cloths (Izar and Rida)</li>
                            <li>• Women: Wear modest, loose-fitting clothing (any color)</li>
                            <li>• Trim nails and remove unwanted hair before Ihram</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-primary">At the Miqat</h4>
                          <ul className="space-y-1 text-muted-foreground ml-4">
                            <li>• Pray 2 rakats (Sunnah of Ihram)</li>
                            <li>• Make intention (Niyyah) for Umrah</li>
                            <li>• Recite Talbiyah: "Labbayka Allahumma bi Umrah"</li>
                            <li>• Continue reciting Talbiyah until starting Tawaf</li>
                          </ul>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-900">
                          <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">Prohibited in Ihram:</p>
                          <ul className="text-sm text-muted-foreground ml-4 space-y-0.5">
                            <li>• Using perfume or scented products</li>
                            <li>• Cutting hair or nails</li>
                            <li>• Intimate relations</li>
                            <li>• Wearing stitched clothes (men only)</li>
                            <li>• Covering head (men) or face (women)</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="tawaf">
                      <AccordionTrigger className="text-lg font-semibold">
                        Step 2: Tawaf (Circumambulation)
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-primary">Entering Masjid al-Haram</h4>
                          <ul className="space-y-1 text-muted-foreground ml-4">
                            <li>• Enter with right foot first</li>
                            <li>• Recite the dua for entering the mosque</li>
                            <li>• Proceed to the Black Stone (Hajar al-Aswad)</li>
                            <li>• Stop reciting Talbiyah when you see the Kaaba</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-primary">Performing Tawaf (7 Circuits)</h4>
                          <ul className="space-y-1 text-muted-foreground ml-4">
                            <li>• Start at the Black Stone, raise hands and say "Bismillahi Allahu Akbar"</li>
                            <li>• Kiss the Black Stone if possible, or point to it</li>
                            <li>• Keep the Kaaba on your left side</li>
                            <li>• Complete 7 counter-clockwise circuits</li>
                            <li>• Men: Uncover right shoulder (Idtiba) and walk briskly in first 3 circuits (Raml)</li>
                            <li>• Recite duas and Quran during Tawaf</li>
                            <li>• Touch Rukn al-Yamani (Yemeni Corner) if possible</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-primary">After Tawaf</h4>
                          <ul className="space-y-1 text-muted-foreground ml-4">
                            <li>• Cover right shoulder (men)</li>
                            <li>• Pray 2 rakats at Maqam Ibrahim (or anywhere in the mosque)</li>
                            <li>• Drink Zamzam water</li>
                            <li>• Return to Black Stone and touch/point to it if possible</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="sai">
                      <AccordionTrigger className="text-lg font-semibold">
                        Step 3: Sa'i (Walking between Safa and Marwah)
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-primary">Starting Sa'i</h4>
                          <ul className="space-y-1 text-muted-foreground ml-4">
                            <li>• Go to Mount Safa</li>
                            <li>• Face the Kaaba and make dua</li>
                            <li>• Recite: "Inna as-Safa wal-Marwata min sha'a'irillah"</li>
                            <li>• Begin walking towards Mount Marwah</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-primary">Performing Sa'i (7 Laps)</h4>
                          <ul className="space-y-1 text-muted-foreground ml-4">
                            <li>• Walk from Safa to Marwah (1st lap)</li>
                            <li>• Men: Jog between the green lights</li>
                            <li>• Women: Walk at normal pace throughout</li>
                            <li>• At Marwah, face Kaaba and make dua</li>
                            <li>• Walk back to Safa (2nd lap)</li>
                            <li>• Continue until completing 7 laps</li>
                            <li>• Safa to Marwah = 1 lap; Marwah to Safa = 1 lap</li>
                            <li>• Recite duas, dhikr, and Quran during Sa'i</li>
                          </ul>
                        </div>
                        <div className="bg-primary/5 p-3 rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            <strong>Note:</strong> The 7th lap ends at Marwah. There is no specific dua for Sa'i; you may recite any supplications.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="halq">
                      <AccordionTrigger className="text-lg font-semibold">
                        Step 4: Halq or Taqsir (Shaving or Trimming Hair)
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-primary">For Men</h4>
                          <ul className="space-y-1 text-muted-foreground ml-4">
                            <li>• <strong>Halq (Shaving):</strong> Shave entire head completely (more rewarding)</li>
                            <li>• <strong>Taqsir (Trimming):</strong> Cut at least 1 inch from all over the head</li>
                            <li>• Barbers available near Masjid al-Haram</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-primary">For Women</h4>
                          <ul className="space-y-1 text-muted-foreground ml-4">
                            <li>• Cut a fingertip's length (about 1 inch) from the hair</li>
                            <li>• Can be done in private accommodation</li>
                            <li>• Shaving is not allowed for women</li>
                          </ul>
                        </div>
                        <div className="bg-primary/5 p-4 rounded-lg">
                          <p className="font-semibold text-primary mb-1">Umrah Complete!</p>
                          <p className="text-sm text-muted-foreground">
                            After cutting/shaving hair, all restrictions of Ihram are lifted. You have successfully completed Umrah. May Allah accept your pilgrimage.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                {/* Additional Recommendations */}
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Recommended Acts After Umrah
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span>Pray in Masjid al-Haram (1 prayer = 100,000 prayers)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span>Visit Masjid an-Nabawi in Madinah and pray in the Rawdah</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span>Visit historical Islamic sites (Jabal al-Nour, Jabal Thawr, etc.)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span>Perform additional Umrahs if time permits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span>Make dua for yourself, family, and all Muslims</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Visa Process Tab */}
          <TabsContent value="visa" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  Saudi Arabia Visa Guide
                </CardTitle>
                <CardDescription>
                  Complete information about visa requirements and application process for Hajj and Umrah
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Visa Types */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Types of Visas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold text-primary mb-2">Hajj Visa</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Valid only during Hajj season</li>
                        <li>• Single entry visa</li>
                        <li>• Duration: 30-90 days</li>
                        <li>• Must be obtained through authorized agents</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold text-primary mb-2">Umrah Visa</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Valid year-round (except Hajj days)</li>
                        <li>• Single or multiple entry</li>
                        <li>• Duration: 30-90 days</li>
                        <li>• Can be obtained online or through agents</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Required Documents */}
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Required Documents
                  </h3>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="passport">
                      <AccordionTrigger>Passport Requirements</AccordionTrigger>
                      <AccordionContent className="space-y-2">
                        <ul className="space-y-1 text-muted-foreground ml-4">
                          <li>• Valid for at least 6 months from travel date</li>
                          <li>• At least 2 blank pages for visa stamps</li>
                          <li>• Clear, undamaged passport</li>
                          <li>• Passport copy (bio-data page)</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="photos">
                      <AccordionTrigger>Photographs</AccordionTrigger>
                      <AccordionContent className="space-y-2">
                        <ul className="space-y-1 text-muted-foreground ml-4">
                          <li>• 2 recent passport-size photos (white background)</li>
                          <li>• Size: 4cm x 6cm</li>
                          <li>• 80% face coverage</li>
                          <li>• No glasses or head coverings (except religious)</li>
                          <li>• Women: Face must be visible, hijab allowed</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="vaccination">
                      <AccordionTrigger>Vaccination Certificates</AccordionTrigger>
                      <AccordionContent className="space-y-2">
                        <ul className="space-y-1 text-muted-foreground ml-4">
                          <li>• <strong>Meningitis (ACWY):</strong> Required, valid for 3 years (taken at least 10 days before travel)</li>
                          <li>• <strong>COVID-19:</strong> Check current requirements</li>
                          <li>• <strong>Polio:</strong> Required for travelers from certain countries</li>
                          <li>• <strong>Yellow Fever:</strong> Required for travelers from endemic countries</li>
                          <li>• Certificates must be in English or Arabic</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="additional">
                      <AccordionTrigger>Additional Documents</AccordionTrigger>
                      <AccordionContent className="space-y-2">
                        <ul className="space-y-1 text-muted-foreground ml-4">
                          <li>• Confirmed flight tickets (round-trip)</li>
                          <li>• Hotel booking confirmation</li>
                          <li>• Travel insurance (recommended)</li>
                          <li>• Proof of relationship for family members (marriage certificate, birth certificate)</li>
                          <li>• Mahram proof for women under 45 (if traveling with male guardian)</li>
                          <li>• Bank statements (if required)</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                {/* Application Process */}
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Application Process
                  </h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">1</div>
                      <div>
                        <h4 className="font-semibold">Choose Package</h4>
                        <p className="text-sm text-muted-foreground">Select a Hajj or Umrah package from Maquam Holidays</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">2</div>
                      <div>
                        <h4 className="font-semibold">Submit Documents</h4>
                        <p className="text-sm text-muted-foreground">Provide all required documents to our team</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">3</div>
                      <div>
                        <h4 className="font-semibold">Visa Processing</h4>
                        <p className="text-sm text-muted-foreground">We handle the entire visa application process (7-14 days)</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">4</div>
                      <div>
                        <h4 className="font-semibold">Receive Visa</h4>
                        <p className="text-sm text-muted-foreground">Get your approved visa and travel documents</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">5</div>
                      <div>
                        <h4 className="font-semibold">Travel</h4>
                        <p className="text-sm text-muted-foreground">Begin your sacred journey to the Holy Land</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Important Notes */}
                <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-900">
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    Important Visa Information
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                    <li>• Apply for visa at least 30 days before travel</li>
                    <li>• Visa fees are non-refundable</li>
                    <li>• Women under 45 must travel with a Mahram (male guardian)</li>
                    <li>• Women 45+ can travel in groups without Mahram</li>
                    <li>• Visa validity starts from issue date, not travel date</li>
                    <li>• Overstaying visa results in heavy fines</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Packing List Tab */}
          <TabsContent value="packing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Luggage className="h-6 w-6 text-primary" />
                  Complete Packing Checklist
                </CardTitle>
                <CardDescription>
                  Essential items and recommendations for your Hajj or Umrah journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Packing Categories */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="documents">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Travel Documents
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 pt-4">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Passport (original + 2 copies)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Visa (print copy)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Flight tickets (print and digital)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Hotel booking confirmations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Vaccination certificates</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Travel insurance documents</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Emergency contact list</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Credit/debit cards and cash (SAR)</span>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="ihram">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Ihram Clothing
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div>
                        <h4 className="font-semibold text-primary mb-2">For Men</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <span>2-3 sets of white Ihram cloths (Izar and Rida)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <span>Ihram belt or safety pins</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <span>Unscented soap and shampoo</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <span>Flip-flops or sandals (no covered shoes)</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary mb-2">For Women</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <span>Modest, loose-fitting clothing (any color)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <span>Hijabs and abayas</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <span>Comfortable shoes (any type)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <span>Unscented toiletries</span>
                          </li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="clothing">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <Luggage className="h-5 w-5 text-primary" />
                        Regular Clothing
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 pt-4">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Comfortable, modest clothing (5-7 sets)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Lightweight, breathable fabrics</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Underwear and socks</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Light jacket or sweater (for air-conditioned areas)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Comfortable walking shoes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Sleepwear</span>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="health">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-primary" />
                        Health & Hygiene
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 pt-4">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Prescription medications (with doctor's note)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>First aid kit (band-aids, pain relievers, antiseptic)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Vitamins and supplements</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Sunscreen (SPF 50+)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Lip balm</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Hand sanitizer</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Wet wipes and tissues</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Face masks</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Toothbrush, toothpaste, and dental floss</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Deodorant (unscented for Ihram)</span>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="accessories">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <Sun className="h-5 w-5 text-primary" />
                        Accessories & Essentials
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 pt-4">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Umbrella (for sun and rain)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Reusable water bottle</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Small backpack or bag</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Money belt or secure pouch</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Mobile phone and charger</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Power bank</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Universal adapter (Saudi Arabia uses Type G plugs)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Quran (pocket size)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Dua book</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Prayer mat (portable)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Tasbih (prayer beads)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Notebook and pen</span>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="optional">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="h-5 w-5 text-primary" />
                        Optional Items
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 pt-4">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Camera (for non-sacred areas only)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Sleeping bag or blanket (for Muzdalifah)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Earplugs and eye mask</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Snacks (dates, nuts, energy bars)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Laundry detergent (travel size)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Clothesline and clips</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span>Zamzam water container (for return journey)</span>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Packing Tips */}
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">Packing Tips</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                    <li>• Pack light - you'll be walking a lot</li>
                    <li>• Use packing cubes to organize items</li>
                    <li>• Keep important documents in carry-on</li>
                    <li>• Label luggage with contact information</li>
                    <li>• Leave space for souvenirs and Zamzam water</li>
                    <li>• Check airline baggage allowance</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Travel Tips Tab */}
          <TabsContent value="tips" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-6 w-6 text-primary" />
                  Essential Travel Tips
                </CardTitle>
                <CardDescription>
                  Practical advice and recommendations for a smooth and blessed journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="before">
                    <AccordionTrigger className="text-lg font-semibold">
                      Before You Travel
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Spiritual Preparation</h4>
                        <ul className="space-y-1 text-muted-foreground ml-4">
                          <li>• Learn Hajj/Umrah rituals thoroughly</li>
                          <li>• Repent sincerely and seek forgiveness</li>
                          <li>• Settle all debts and obligations</li>
                          <li>• Write a will (Islamic requirement)</li>
                          <li>• Seek forgiveness from family and friends</li>
                          <li>• Make sincere intention (Niyyah)</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Physical Preparation</h4>
                        <ul className="space-y-1 text-muted-foreground ml-4">
                          <li>• Get medical check-up</li>
                          <li>• Complete all required vaccinations</li>
                          <li>• Build stamina through walking exercises</li>
                          <li>• Consult doctor about medications</li>
                          <li>• Get travel insurance</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Financial Preparation</h4>
                        <ul className="space-y-1 text-muted-foreground ml-4">
                          <li>• Inform bank about travel dates</li>
                          <li>• Carry multiple payment methods</li>
                          <li>• Exchange some currency to SAR</li>
                          <li>• Keep emergency funds separate</li>
                          <li>• Make copies of financial documents</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="during">
                    <AccordionTrigger className="text-lg font-semibold">
                      During Your Journey
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Health & Safety</h4>
                        <ul className="space-y-1 text-muted-foreground ml-4">
                          <li>• Stay hydrated - drink plenty of water</li>
                          <li>• Protect yourself from sun (umbrella, sunscreen)</li>
                          <li>• Wear comfortable, broken-in shoes</li>
                          <li>• Rest when needed - don't overexert</li>
                          <li>• Wash hands frequently</li>
                          <li>• Avoid crowded areas if feeling unwell</li>
                          <li>• Keep emergency contacts handy</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Spiritual Focus</h4>
                        <ul className="space-y-1 text-muted-foreground ml-4">
                          <li>• Maintain focus on worship</li>
                          <li>• Avoid arguments and disputes</li>
                          <li>• Be patient with crowds</li>
                          <li>• Help fellow pilgrims when possible</li>
                          <li>• Make abundant dua</li>
                          <li>• Recite Quran regularly</li>
                          <li>• Perform extra prayers in Haram</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Practical Tips</h4>
                        <ul className="space-y-1 text-muted-foreground ml-4">
                          <li>• Keep hotel address in Arabic</li>
                          <li>• Take photos of landmarks near hotel</li>
                          <li>• Carry small bills for purchases</li>
                          <li>• Use hotel safe for valuables</li>
                          <li>• Stay with your group</li>
                          <li>• Learn basic Arabic phrases</li>
                          <li>• Download offline maps</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="weather">
                    <AccordionTrigger className="text-lg font-semibold">
                      Weather & Climate
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                            <Sun className="h-5 w-5" />
                            Summer (May-September)
                          </h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            <li>• Temperature: 35-50°C (95-122°F)</li>
                            <li>• Very hot and dry</li>
                            <li>• Bring light, breathable clothing</li>
                            <li>• Use umbrella for shade</li>
                            <li>• Stay hydrated constantly</li>
                          </ul>
                        </div>
                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                            <Moon className="h-5 w-5" />
                            Winter (November-February)
                          </h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            <li>• Temperature: 15-30°C (59-86°F)</li>
                            <li>• Mild and pleasant</li>
                            <li>• Bring light jacket for evenings</li>
                            <li>• Best time for Umrah</li>
                            <li>• Less crowded than Hajj season</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="money">
                    <AccordionTrigger className="text-lg font-semibold">
                      Money & Expenses
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div>
                        <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                          <Wallet className="h-5 w-5" />
                          Currency & Payment
                        </h4>
                        <ul className="space-y-1 text-muted-foreground ml-4">
                          <li>• Currency: Saudi Riyal (SAR)</li>
                          <li>• 1 SAR ≈ ₹22-23 INR (check current rate)</li>
                          <li>• Credit cards widely accepted</li>
                          <li>• ATMs available throughout Makkah and Madinah</li>
                          <li>• Carry cash for small purchases</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Typical Expenses</h4>
                        <ul className="space-y-1 text-muted-foreground ml-4">
                          <li>• Meals: 20-50 SAR per meal</li>
                          <li>• Water: 1-2 SAR per bottle</li>
                          <li>• Taxi: 10-30 SAR within city</li>
                          <li>• Souvenirs: 10-100 SAR</li>
                          <li>• Dates: 20-50 SAR per kg</li>
                          <li>• Zamzam container: 5-15 SAR</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="communication">
                    <AccordionTrigger className="text-lg font-semibold">
                      Communication & Connectivity
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div>
                        <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                          <Phone className="h-5 w-5" />
                          Staying Connected
                        </h4>
                        <ul className="space-y-1 text-muted-foreground ml-4">
                          <li>• Free WiFi available in most hotels and Haram</li>
                          <li>• Buy local SIM card at airport (STC, Mobily, Zain)</li>
                          <li>• International roaming can be expensive</li>
                          <li>• WhatsApp works well for communication</li>
                          <li>• Download useful apps before travel</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Useful Apps</h4>
                        <ul className="space-y-1 text-muted-foreground ml-4">
                          <li>• Nusuk (official Hajj/Umrah app)</li>
                          <li>• Muslim Pro (prayer times, Qibla)</li>
                          <li>• Google Maps (navigation)</li>
                          <li>• Google Translate (Arabic translation)</li>
                          <li>• Careem/Uber (transportation)</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="etiquette">
                    <AccordionTrigger className="text-lg font-semibold">
                      Cultural Etiquette
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Dress Code</h4>
                        <ul className="space-y-1 text-muted-foreground ml-4">
                          <li>• Dress modestly at all times</li>
                          <li>• Women: Cover hair, arms, and legs</li>
                          <li>• Men: Avoid shorts and sleeveless shirts</li>
                          <li>• Remove shoes when entering mosques</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Behavior</h4>
                        <ul className="space-y-1 text-muted-foreground ml-4">
                          <li>• Be respectful in holy places</li>
                          <li>• No photography inside Haram</li>
                          <li>• Keep voices low in mosques</li>
                          <li>• Respect prayer times (shops close)</li>
                          <li>• No public displays of affection</li>
                          <li>• Be patient in crowds</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Emergency Contacts */}
                <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-900">
                  <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2 flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Emergency Contacts
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                    <li>• Emergency Services: 911</li>
                    <li>• Police: 999</li>
                    <li>• Ambulance: 997</li>
                    <li>• Traffic Accidents: 993</li>
                    <li>• Indian Consulate Jeddah: +966-12-6614666</li>
                    <li>• Maquam Holidays Support: [Contact Number]</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* FAQ Section */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-3">
              <HelpCircle className="h-8 w-8 text-primary" />
              <CardTitle>Frequently Asked Questions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="faq-1">
                <AccordionTrigger>What documents do I need for Umrah?</AccordionTrigger>
                <AccordionContent>
                  You'll need a valid passport (at least 6 months validity), visa, vaccination certificates (especially Meningitis ACWY), travel insurance, confirmed flight tickets, and hotel booking confirmation. We assist with all visa processing and documentation.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-2">
                <AccordionTrigger>How far in advance should I book?</AccordionTrigger>
                <AccordionContent>
                  We recommend booking at least 2-3 months in advance for Umrah and 6-12 months for Hajj to ensure availability and better rates. Early booking also allows sufficient time for visa processing and preparation.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-3">
                <AccordionTrigger>What is included in the packages?</AccordionTrigger>
                <AccordionContent>
                  Our packages typically include round-trip flights, hotel accommodations near Haram, visa assistance, airport transfers, and guided tours. Premium packages include additional services like meals, private transportation, and Ziyarat tours. Check specific package details for complete inclusions.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-4">
                <AccordionTrigger>Can I customize my package?</AccordionTrigger>
                <AccordionContent>
                  Yes Use our AI Package Generator to create a custom package tailored to your budget, preferences, travel dates, and specific requirements. You can choose hotel proximity, service level, and additional services.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-5">
                <AccordionTrigger>What is your cancellation policy?</AccordionTrigger>
                <AccordionContent>
                  Cancellation policies vary by package and booking date. Generally, cancellations made 60+ days before departure receive a full refund minus processing fees. Cancellations within 30-60 days receive 50% refund, and within 30 days are non-refundable. Contact us for specific details.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-6">
                <AccordionTrigger>Do women need a Mahram for Umrah?</AccordionTrigger>
                <AccordionContent>
                  Women under 45 years must travel with a Mahram (male guardian - husband, father, brother, son, or uncle). Women 45 years and above can travel in organized groups without a Mahram. Recent regulations may vary, so check current requirements.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-7">
                <AccordionTrigger>What vaccinations are required?</AccordionTrigger>
                <AccordionContent>
                  Meningitis ACWY vaccination is mandatory and must be taken at least 10 days before travel (valid for 3 years). COVID-19 vaccination may be required (check current regulations). Travelers from certain countries need Polio and Yellow Fever vaccinations. All certificates must be in English or Arabic.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-8">
                <AccordionTrigger>How long does visa processing take?</AccordionTrigger>
                <AccordionContent>
                  Visa processing typically takes 7-14 working days. However, during peak seasons (Ramadan, Hajj), it may take longer. We recommend applying at least 30 days before your intended travel date to allow sufficient processing time.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-9">
                <AccordionTrigger>What is the best time to perform Umrah?</AccordionTrigger>
                <AccordionContent>
                  Umrah can be performed year-round except during Hajj days (8-13 Dhul Hijjah). The best time is during Ramadan (most rewarding) or winter months (November-February) when weather is pleasant. Avoid summer months (May-September) due to extreme heat.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-10">
                <AccordionTrigger>How much money should I bring?</AccordionTrigger>
                <AccordionContent>
                  Budget approximately 1,000-2,000 SAR (₹22,000-44,000) per person for expenses beyond the package (meals, shopping, transportation, tips). Carry a mix of cash and cards. ATMs are widely available, and credit cards are accepted in most places.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact CTA */}
        <Card className="bg-primary text-primary-foreground max-w-4xl mx-auto">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Need More Information?</h3>
            <p className="mb-6 opacity-90">
              Our travel experts are here to help you plan your perfect pilgrimage
            </p>
            <div className="flex flex-col xl:flex-row gap-4 justify-center">
              <a href="/contact" className="inline-block">
                <button className="bg-background text-foreground hover:bg-background/90 px-6 py-3 rounded-lg font-semibold transition-colors">
                  Contact Us
                </button>
              </a>
              <a href="/packages" className="inline-block">
                <button className="bg-background/10 hover:bg-background/20 text-primary-foreground px-6 py-3 rounded-lg font-semibold transition-colors border border-primary-foreground/20">
                  View Packages
                </button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


