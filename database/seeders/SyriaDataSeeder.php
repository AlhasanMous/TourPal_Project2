<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Place;
use App\Models\User;
use Illuminate\Database\Seeder;

class SyriaDataSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@tourpal.sy')->first();

        // ============================================================
        // CITIES
        // ============================================================
        $cities = [

            // ─── المحافظات الرئيسية ───────────────────────────────
            [
                'name_ar' => 'دمشق',
                'name_en' => 'Damascus',
                'region'  => 'محافظة دمشق',
            ],
            [
                'name_ar' => 'حلب',
                'name_en' => 'Aleppo',
                'region'  => 'محافظة حلب',
            ],
            [
                'name_ar' => 'حمص',
                'name_en' => 'Homs',
                'region'  => 'محافظة حمص',
            ],
            [
                'name_ar' => 'حماة',
                'name_en' => 'Hama',
                'region'  => 'محافظة حماة',
            ],
            [
                'name_ar' => 'اللاذقية',
                'name_en' => 'Latakia',
                'region'  => 'محافظة اللاذقية',
            ],
            [
                'name_ar' => 'طرطوس',
                'name_en' => 'Tartus',
                'region'  => 'محافظة طرطوس',
            ],
            [
                'name_ar' => 'درعا',
                'name_en' => 'Daraa',
                'region'  => 'محافظة درعا',
            ],
            [
                'name_ar' => 'السويداء',
                'name_en' => 'As-Suwayda',
                'region'  => 'محافظة السويداء',
            ],
            [
                'name_ar' => 'دير الزور',
                'name_en' => 'Deir ez-Zor',
                'region'  => 'محافظة دير الزور',
            ],
            [
                'name_ar' => 'الحسكة',
                'name_en' => 'Al-Hasakah',
                'region'  => 'محافظة الحسكة',
            ],

            // ─── ريف دمشق ────────────────────────────────────────
            [
                'name_ar' => 'النبك',
                'name_en' => 'Al-Nabk',
                'region'  => 'ريف دمشق',
            ],
            [
                'name_ar' => 'القطيفة',
                'name_en' => 'Al-Qutayfah',
                'region'  => 'ريف دمشق',
            ],
            [
                'name_ar' => 'يبرود',
                'name_en' => 'Yabrud',
                'region'  => 'ريف دمشق',
            ],
            [
                'name_ar' => 'معلولا',
                'name_en' => 'Maaloula',
                'region'  => 'ريف دمشق',
            ],
            [
                'name_ar' => 'صيدنايا',
                'name_en' => 'Saidnaya',
                'region'  => 'ريف دمشق',
            ],
            [
                'name_ar' => 'الزبداني',
                'name_en' => 'Az-Zabadani',
                'region'  => 'ريف دمشق',
            ],
            [
                'name_ar' => 'بلودان',
                'name_en' => 'Bloudan',
                'region'  => 'ريف دمشق',
            ],

            // ─── ريف حمص ─────────────────────────────────────────
            [
                'name_ar' => 'تدمر',
                'name_en' => 'Palmyra',
                'region'  => 'ريف حمص',
            ],
            [
                'name_ar' => 'صافيتا',
                'name_en' => 'Safita',
                'region'  => 'ريف حمص',
            ],
            [
                'name_ar' => 'مصياف',
                'name_en' => 'Masyaf',
                'region'  => 'ريف حمص',
            ],

            // ─── ريف حماة ────────────────────────────────────────
            [
                'name_ar' => 'أفاميا',
                'name_en' => 'Apamea',
                'region'  => 'ريف حماة',
            ],

            // ─── ريف اللاذقية ────────────────────────────────────
            [
                'name_ar' => 'جبلة',
                'name_en' => 'Jableh',
                'region'  => 'ريف اللاذقية',
            ],
            [
                'name_ar' => 'صلنفة',
                'name_en' => 'Slunfeh',
                'region'  => 'ريف اللاذقية',
            ],

            // ─── ريف طرطوس ───────────────────────────────────────
            [
                'name_ar' => 'أرواد',
                'name_en' => 'Arwad',
                'region'  => 'ريف طرطوس',
            ],

            // ─── ريف درعا ────────────────────────────────────────
            [
                'name_ar' => 'بصرى الشام',
                'name_en' => 'Bosra',
                'region'  => 'ريف درعا',
            ],

            // ─── ريف السويداء ─────────────────────────────────────
            [
                'name_ar' => 'شهبا',
                'name_en' => 'Shahba',
                'region'  => 'ريف السويداء',
            ],
            [
                'name_ar' => 'قنوات',
                'name_en' => 'Qanawat',
                'region'  => 'ريف السويداء',
            ],
        ];

        // أنشئ المدن واحفظ ID كل مدينة
        $cityMap = [];
        foreach ($cities as $city) {
            $created = City::firstOrCreate(
                ['name_en' => $city['name_en']],
                $city
            );
            $cityMap[$city['name_en']] = $created->id;
        }

        // ============================================================
        // PLACES
        // ============================================================
        $places = [

            // ─── دمشق (3 أماكن) ──────────────────────────────────
            [
                'name_ar'              => 'الجامع الأموي الكبير',
                'name_en'              => 'Umayyad Mosque',
                'description_ar'       => 'أحد أقدم المساجد في العالم وأكثرها أهمية في التاريخ الإسلامي، يقع في قلب دمشق القديمة. بُني في القرن الثامن الميلادي على أنقاض كاتدرائية يوحنا المعمدان.',
                'description_en'       => 'One of the oldest and most significant mosques in the world, located in the heart of old Damascus. Built in the 8th century on the ruins of the Cathedral of John the Baptist.',
                'city'                 => 'Damascus',
                'category'             => 'historical',
                'visit_duration_hours' => 2,
                'opening_hours'        => [
                    'saturday'  => ['open' => '08:00', 'close' => '22:00'],
                    'sunday'    => ['open' => '08:00', 'close' => '22:00'],
                    'monday'    => ['open' => '08:00', 'close' => '22:00'],
                    'tuesday'   => ['open' => '08:00', 'close' => '22:00'],
                    'wednesday' => ['open' => '08:00', 'close' => '22:00'],
                    'thursday'  => ['open' => '08:00', 'close' => '22:00'],
                    'friday'    => ['open' => '13:30', 'close' => '22:00'],
                ],
            ],
            [
                'name_ar'              => 'سوق الحميدية',
                'name_en'              => 'Al-Hamidiyah Souq',
                'description_ar'       => 'أشهر أسواق دمشق التاريخية، يمتد بطول 600 متر وسقفه من الحديد المثقب، يربط باب الجابية بالجامع الأموي. مليء بالمحلات التقليدية والحرف اليدوية.',
                'description_en'       => 'Damascus most famous historical market, stretching 600 meters with a perforated iron roof, connecting Bab al-Jabiya to the Umayyad Mosque. Filled with traditional shops and handicrafts.',
                'city'                 => 'Damascus',
                'category'             => 'historical',
                'visit_duration_hours' => 2,
                'opening_hours'        => [
                    'saturday'  => ['open' => '09:00', 'close' => '21:00'],
                    'sunday'    => ['open' => '09:00', 'close' => '21:00'],
                    'monday'    => ['open' => '09:00', 'close' => '21:00'],
                    'tuesday'   => ['open' => '09:00', 'close' => '21:00'],
                    'wednesday' => ['open' => '09:00', 'close' => '21:00'],
                    'thursday'  => ['open' => '09:00', 'close' => '21:00'],
                    'friday'    => null,
                ],
            ],
            [
                'name_ar'              => 'قلعة دمشق',
                'name_en'              => 'Damascus Citadel',
                'description_ar'       => 'قلعة تاريخية تقع في الزاوية الشمالية الغربية من دمشق القديمة، بُنيت في العهد الروماني وأعيد بناؤها في العصر الأيوبي. تحتوي على متحف للتاريخ العسكري.',
                'description_en'       => 'A historic citadel located at the northwest corner of old Damascus, built during the Roman era and rebuilt during the Ayyubid period. Contains a military history museum.',
                'city'                 => 'Damascus',
                'category'             => 'historical',
                'visit_duration_hours' => 2,
                'opening_hours'        => [
                    'saturday'  => ['open' => '09:00', 'close' => '18:00'],
                    'sunday'    => ['open' => '09:00', 'close' => '18:00'],
                    'monday'    => ['open' => '09:00', 'close' => '18:00'],
                    'tuesday'   => ['open' => '09:00', 'close' => '18:00'],
                    'wednesday' => ['open' => '09:00', 'close' => '18:00'],
                    'thursday'  => ['open' => '09:00', 'close' => '18:00'],
                    'friday'    => null,
                ],
            ],

            // ─── حلب (3 أماكن) ───────────────────────────────────
            [
                'name_ar'              => 'قلعة حلب',
                'name_en'              => 'Aleppo Citadel',
                'description_ar'       => 'إحدى أقدم وأكبر القلاع في العالم، تقع على تل دائري في وسط مدينة حلب القديمة. يعود تاريخها إلى الألفية الثالثة قبل الميلاد وهي مدرجة في قائمة التراث العالمي لليونسكو.',
                'description_en'       => 'One of the oldest and largest castles in the world, situated on a circular hill in the center of old Aleppo. Dating back to the third millennium BC and listed as a UNESCO World Heritage Site.',
                'city'                 => 'Aleppo',
                'category'             => 'historical',
                'visit_duration_hours' => 3,
                'opening_hours'        => [
                    'saturday'  => ['open' => '09:00', 'close' => '18:00'],
                    'sunday'    => ['open' => '09:00', 'close' => '18:00'],
                    'monday'    => ['open' => '09:00', 'close' => '18:00'],
                    'tuesday'   => ['open' => '09:00', 'close' => '18:00'],
                    'wednesday' => ['open' => '09:00', 'close' => '18:00'],
                    'thursday'  => ['open' => '09:00', 'close' => '18:00'],
                    'friday'    => null,
                ],
            ],
            [
                'name_ar'              => 'المدينة القديمة في حلب',
                'name_en'              => 'Old City of Aleppo',
                'description_ar'       => 'من أجمل المدن القديمة في العالم وأكثرها اكتمالاً، تضم أكثر من 700 موقع مسجل تاريخياً تشمل الحمامات والخانات والمساجد والكنائس والأسواق.',
                'description_en'       => 'One of the most beautiful and complete old cities in the world, containing over 700 historically registered sites including baths, khans, mosques, churches and markets.',
                'city'                 => 'Aleppo',
                'category'             => 'historical',
                'visit_duration_hours' => 4,
                'opening_hours'        => [
                    'saturday'  => ['open' => '08:00', 'close' => '22:00'],
                    'sunday'    => ['open' => '08:00', 'close' => '22:00'],
                    'monday'    => ['open' => '08:00', 'close' => '22:00'],
                    'tuesday'   => ['open' => '08:00', 'close' => '22:00'],
                    'wednesday' => ['open' => '08:00', 'close' => '22:00'],
                    'thursday'  => ['open' => '08:00', 'close' => '22:00'],
                    'friday'    => ['open' => '08:00', 'close' => '22:00'],
                ],
            ],
            [
                'name_ar'              => 'جامع حلب الكبير',
                'name_en'              => 'Great Mosque of Aleppo',
                'description_ar'       => 'يعد من أكبر وأقدم المساجد في سوريا، يقع في المدينة القديمة بالقرب من قلعة حلب. يتميز بمئذنته الشاهقة التي بُنيت في القرن الحادي عشر الميلادي.',
                'description_en'       => 'One of the largest and oldest mosques in Syria, located in the old city near Aleppo Citadel. Notable for its towering minaret built in the 11th century.',
                'city'                 => 'Aleppo',
                'category'             => 'historical',
                'visit_duration_hours' => 1,
                'opening_hours'        => [
                    'saturday'  => ['open' => '08:00', 'close' => '20:00'],
                    'sunday'    => ['open' => '08:00', 'close' => '20:00'],
                    'monday'    => ['open' => '08:00', 'close' => '20:00'],
                    'tuesday'   => ['open' => '08:00', 'close' => '20:00'],
                    'wednesday' => ['open' => '08:00', 'close' => '20:00'],
                    'thursday'  => ['open' => '08:00', 'close' => '20:00'],
                    'friday'    => ['open' => '13:30', 'close' => '20:00'],
                ],
            ],

            // ─── تدمر (3 أماكن) ──────────────────────────────────
            [
                'name_ar'              => 'آثار تدمر',
                'name_en'              => 'Palmyra Ruins',
                'description_ar'       => 'مدينة أثرية عريقة تعود إلى القرن الأول قبل الميلاد، وصفها المؤرخون بـ"عروس الصحراء". تضم معابد وأعمدة وقوس النصر الشهير.',
                'description_en'       => 'An ancient archaeological city dating back to the first century BC, described by historians as the "Bride of the Desert". Contains temples, columns and the famous Arch of Triumph.',
                'city'                 => 'Palmyra',
                'category'             => 'historical',
                'visit_duration_hours' => 4,
                'opening_hours'        => [
                    'saturday'  => ['open' => '08:00', 'close' => '18:00'],
                    'sunday'    => ['open' => '08:00', 'close' => '18:00'],
                    'monday'    => ['open' => '08:00', 'close' => '18:00'],
                    'tuesday'   => ['open' => '08:00', 'close' => '18:00'],
                    'wednesday' => ['open' => '08:00', 'close' => '18:00'],
                    'thursday'  => ['open' => '08:00', 'close' => '18:00'],
                    'friday'    => ['open' => '08:00', 'close' => '18:00'],
                ],
            ],
            [
                'name_ar'              => 'قلعة فخر الدين المعني',
                'name_en'              => 'Fakhr-al-Din Castle',
                'description_ar'       => 'قلعة عربية تقع على قمة تل مشرف على مدينة تدمر، تعود إلى القرن الثالث عشر الميلادي. توفر منظراً بانورامياً رائعاً على المدينة الأثرية والصحراء.',
                'description_en'       => 'An Arab castle located on a hilltop overlooking Palmyra, dating to the 13th century. Offers a stunning panoramic view of the archaeological city and desert.',
                'city'                 => 'Palmyra',
                'category'             => 'historical',
                'visit_duration_hours' => 2,
                'opening_hours'        => [
                    'saturday'  => ['open' => '08:00', 'close' => '17:00'],
                    'sunday'    => ['open' => '08:00', 'close' => '17:00'],
                    'monday'    => ['open' => '08:00', 'close' => '17:00'],
                    'tuesday'   => ['open' => '08:00', 'close' => '17:00'],
                    'wednesday' => ['open' => '08:00', 'close' => '17:00'],
                    'thursday'  => ['open' => '08:00', 'close' => '17:00'],
                    'friday'    => ['open' => '08:00', 'close' => '17:00'],
                ],
            ],
            [
                'name_ar'              => 'متحف تدمر',
                'name_en'              => 'Palmyra Museum',
                'description_ar'       => 'يضم مجموعة نادرة من التحف والمنحوتات والمقتنيات الأثرية المكتشفة في آثار تدمر، يعكس ازدهار الحضارة التدمرية وتأثيرها على الحضارات المحيطة.',
                'description_en'       => 'Contains a rare collection of artifacts, sculptures, and archaeological finds from Palmyra ruins, reflecting the prosperity of Palmyrene civilization and its influence.',
                'city'                 => 'Palmyra',
                'category'             => 'historical',
                'visit_duration_hours' => 2,
                'opening_hours'        => [
                    'saturday'  => ['open' => '09:00', 'close' => '16:00'],
                    'sunday'    => ['open' => '09:00', 'close' => '16:00'],
                    'monday'    => ['open' => '09:00', 'close' => '16:00'],
                    'tuesday'   => ['open' => '09:00', 'close' => '16:00'],
                    'wednesday' => ['open' => '09:00', 'close' => '16:00'],
                    'thursday'  => ['open' => '09:00', 'close' => '16:00'],
                    'friday'    => null,
                ],
            ],

            // ─── حماة (3 أماكن) ──────────────────────────────────
            [
                'name_ar'              => 'نواعير حماة',
                'name_en'              => 'Norias of Hama',
                'description_ar'       => 'عجلات مائية ضخمة تعود إلى القرون الوسطى، أكبرها يبلغ قطره 21 متراً. كانت تستخدم لرفع الماء من نهر العاصي لري البساتين والمدينة، وهي رمز مدينة حماة.',
                'description_en'       => 'Massive medieval water wheels, the largest of which has a diameter of 21 meters. Used to lift water from the Orontes River to irrigate orchards and the city, they are the symbol of Hama.',
                'city'                 => 'Hama',
                'category'             => 'historical',
                'visit_duration_hours' => 2,
                'opening_hours'        => [
                    'saturday'  => ['open' => '08:00', 'close' => '22:00'],
                    'sunday'    => ['open' => '08:00', 'close' => '22:00'],
                    'monday'    => ['open' => '08:00', 'close' => '22:00'],
                    'tuesday'   => ['open' => '08:00', 'close' => '22:00'],
                    'wednesday' => ['open' => '08:00', 'close' => '22:00'],
                    'thursday'  => ['open' => '08:00', 'close' => '22:00'],
                    'friday'    => ['open' => '08:00', 'close' => '22:00'],
                ],
            ],
            [
                'name_ar'              => 'آثار أفاميا',
                'name_en'              => 'Apamea Ruins',
                'description_ar'       => 'مدينة أثرية رومانية تقع على هضبة مشرفة على سهل الغاب، تشتهر بشارعها العمودي الطويل المحاط بالأعمدة الرومانية التي يبلغ طولها أكثر من 2 كيلومتر.',
                'description_en'       => 'A Roman archaeological city on a plateau overlooking the Ghab plain, famous for its long colonnaded street with Roman columns stretching more than 2 kilometers.',
                'city'                 => 'Apamea',
                'category'             => 'historical',
                'visit_duration_hours' => 3,
                'opening_hours'        => [
                    'saturday'  => ['open' => '08:00', 'close' => '18:00'],
                    'sunday'    => ['open' => '08:00', 'close' => '18:00'],
                    'monday'    => ['open' => '08:00', 'close' => '18:00'],
                    'tuesday'   => ['open' => '08:00', 'close' => '18:00'],
                    'wednesday' => ['open' => '08:00', 'close' => '18:00'],
                    'thursday'  => ['open' => '08:00', 'close' => '18:00'],
                    'friday'    => ['open' => '08:00', 'close' => '18:00'],
                ],
            ],
            [
                'name_ar'              => 'قلعة شيزر',
                'name_en'              => 'Shaizar Castle',
                'description_ar'       => 'قلعة تاريخية تقع على صخرة شاهقة فوق نهر العاصي، تعود إلى العهد الإسلامي المبكر وكانت معقلاً للمنقذيين. توفر مناظر خلابة على الوادي والنهر.',
                'description_en'       => 'A historic castle perched on a towering rock above the Orontes River, dating to the early Islamic era and was a stronghold of the Munqidhites. Offers stunning views of the valley.',
                'city'                 => 'Hama',
                'category'             => 'historical',
                'visit_duration_hours' => 2,
                'opening_hours'        => [
                    'saturday'  => ['open' => '09:00', 'close' => '17:00'],
                    'sunday'    => ['open' => '09:00', 'close' => '17:00'],
                    'monday'    => ['open' => '09:00', 'close' => '17:00'],
                    'tuesday'   => ['open' => '09:00', 'close' => '17:00'],
                    'wednesday' => ['open' => '09:00', 'close' => '17:00'],
                    'thursday'  => ['open' => '09:00', 'close' => '17:00'],
                    'friday'    => null,
                ],
            ],

            // ─── اللاذقية (3 أماكن) ──────────────────────────────
            [
                'name_ar'              => 'شاطئ الشاطئ الأزرق',
                'name_en'              => 'Blue Beach Latakia',
                'description_ar'       => 'أجمل شواطئ اللاذقية وأكثرها شهرة، يتميز بمياهه الزرقاء النقية ورماله الذهبية الناعمة. يوفر خدمات سياحية متكاملة ومرافق ترفيهية للعائلات.',
                'description_en'       => 'The most beautiful and famous beach in Latakia, known for its clear blue waters and fine golden sand. Offers comprehensive tourist services and recreational facilities for families.',
                'city'                 => 'Latakia',
                'category'             => 'nature',
                'visit_duration_hours' => 4,
                'opening_hours'        => [
                    'saturday'  => ['open' => '07:00', 'close' => '22:00'],
                    'sunday'    => ['open' => '07:00', 'close' => '22:00'],
                    'monday'    => ['open' => '07:00', 'close' => '22:00'],
                    'tuesday'   => ['open' => '07:00', 'close' => '22:00'],
                    'wednesday' => ['open' => '07:00', 'close' => '22:00'],
                    'thursday'  => ['open' => '07:00', 'close' => '22:00'],
                    'friday'    => ['open' => '07:00', 'close' => '22:00'],
                ],
            ],
            [
                'name_ar'              => 'قلعة صلاح الدين',
                'name_en'              => 'Saladin Castle',
                'description_ar'       => 'قلعة صليبية ضخمة تقع في الجبال الساحلية بين اللاذقية وجبلة، تعد من أروع القلاع الصليبية المحفوظة في العالم. مدرجة في قائمة التراث العالمي لليونسكو.',
                'description_en'       => 'A massive Crusader castle in the coastal mountains between Latakia and Jableh, considered one of the finest preserved Crusader castles in the world. UNESCO World Heritage Site.',
                'city'                 => 'Latakia',
                'category'             => 'historical',
                'visit_duration_hours' => 3,
                'opening_hours'        => [
                    'saturday'  => ['open' => '09:00', 'close' => '18:00'],
                    'sunday'    => ['open' => '09:00', 'close' => '18:00'],
                    'monday'    => ['open' => '09:00', 'close' => '18:00'],
                    'tuesday'   => ['open' => '09:00', 'close' => '18:00'],
                    'wednesday' => ['open' => '09:00', 'close' => '18:00'],
                    'thursday'  => ['open' => '09:00', 'close' => '18:00'],
                    'friday'    => null,
                ],
            ],
            [
                'name_ar'              => 'أوغاريت',
                'name_en'              => 'Ugarit',
                'description_ar'       => 'مدينة أثرية تقع شمال اللاذقية، تعد من أهم المواقع الأثرية في العالم لاكتشاف أول أبجدية في التاريخ البشري. ازدهرت بين عامي 1450 و1200 قبل الميلاد.',
                'description_en'       => 'An archaeological city north of Latakia, considered one of the most important archaeological sites in the world for discovering the first alphabet in human history. Flourished between 1450 and 1200 BC.',
                'city'                 => 'Latakia',
                'category'             => 'historical',
                'visit_duration_hours' => 2,
                'opening_hours'        => [
                    'saturday'  => ['open' => '09:00', 'close' => '17:00'],
                    'sunday'    => ['open' => '09:00', 'close' => '17:00'],
                    'monday'    => ['open' => '09:00', 'close' => '17:00'],
                    'tuesday'   => ['open' => '09:00', 'close' => '17:00'],
                    'wednesday' => ['open' => '09:00', 'close' => '17:00'],
                    'thursday'  => ['open' => '09:00', 'close' => '17:00'],
                    'friday'    => null,
                ],
            ],

            // ─── بصرى (3 أماكن) ──────────────────────────────────
            [
                'name_ar'              => 'المسرح الروماني في بصرى',
                'name_en'              => 'Bosra Roman Theatre',
                'description_ar'       => 'أحد أكمل المسارح الرومانية في العالم، يعود إلى القرن الثاني الميلادي ويتسع لـ15,000 مشاهد. لا يزال يستخدم لإقامة المهرجانات الثقافية السنوية.',
                'description_en'       => 'One of the most complete Roman theatres in the world, dating to the 2nd century AD and seating 15,000 spectators. Still used for annual cultural festivals.',
                'city'                 => 'Bosra',
                'category'             => 'historical',
                'visit_duration_hours' => 3,
                'opening_hours'        => [
                    'saturday'  => ['open' => '08:00', 'close' => '18:00'],
                    'sunday'    => ['open' => '08:00', 'close' => '18:00'],
                    'monday'    => ['open' => '08:00', 'close' => '18:00'],
                    'tuesday'   => ['open' => '08:00', 'close' => '18:00'],
                    'wednesday' => ['open' => '08:00', 'close' => '18:00'],
                    'thursday'  => ['open' => '08:00', 'close' => '18:00'],
                    'friday'    => ['open' => '08:00', 'close' => '18:00'],
                ],
            ],
            [
                'name_ar'              => 'قلعة بصرى',
                'name_en'              => 'Bosra Citadel',
                'description_ar'       => 'قلعة عربية أحاطت بالمسرح الروماني لحمايته في العصور الوسطى، تعد نموذجاً فريداً لتحويل المبنى الروماني إلى تحصين عسكري. جزء من موقع التراث العالمي لليونسكو.',
                'description_en'       => 'An Arab citadel that surrounded the Roman theatre to protect it in the Middle Ages, a unique example of converting a Roman structure into a military fortification. Part of the UNESCO World Heritage Site.',
                'city'                 => 'Bosra',
                'category'             => 'historical',
                'visit_duration_hours' => 2,
                'opening_hours'        => [
                    'saturday'  => ['open' => '08:00', 'close' => '18:00'],
                    'sunday'    => ['open' => '08:00', 'close' => '18:00'],
                    'monday'    => ['open' => '08:00', 'close' => '18:00'],
                    'tuesday'   => ['open' => '08:00', 'close' => '18:00'],
                    'wednesday' => ['open' => '08:00', 'close' => '18:00'],
                    'thursday'  => ['open' => '08:00', 'close' => '18:00'],
                    'friday'    => ['open' => '08:00', 'close' => '18:00'],
                ],
            ],
            [
                'name_ar'              => 'الجامع العمري في بصرى',
                'name_en'              => 'Al-Omari Mosque Bosra',
                'description_ar'       => 'أقدم مسجد في سوريا، يعود إلى الفتح الإسلامي في القرن السابع الميلادي. مبني بالحجارة البازلتية السوداء المميزة لمنطقة حوران.',
                'description_en'       => 'The oldest mosque in Syria, dating back to the Islamic conquest in the 7th century AD. Built with distinctive black basalt stones characteristic of the Hauran region.',
                'city'                 => 'Bosra',
                'category'             => 'historical',
                'visit_duration_hours' => 1,
                'opening_hours'        => [
                    'saturday'  => ['open' => '08:00', 'close' => '20:00'],
                    'sunday'    => ['open' => '08:00', 'close' => '20:00'],
                    'monday'    => ['open' => '08:00', 'close' => '20:00'],
                    'tuesday'   => ['open' => '08:00', 'close' => '20:00'],
                    'wednesday' => ['open' => '08:00', 'close' => '20:00'],
                    'thursday'  => ['open' => '08:00', 'close' => '20:00'],
                    'friday'    => ['open' => '13:00', 'close' => '20:00'],
                ],
            ],

            // ─── معلولا (2 مكان) ─────────────────────────────────
            [
                'name_ar'              => 'دير مار تقلا',
                'name_en'              => 'Mar Thecla Monastery',
                'description_ar'       => 'دير مسيحي منحوت في الصخر يعود إلى القرن الرابع الميلادي، يضم شقاً صخرياً أسطورياً تشق منه القديسة تقلا طريقها. معلولا من القرى النادرة التي لا تزال تتحدث الآرامية.',
                'description_en'       => 'A Christian monastery carved into rock dating to the 4th century AD, containing a legendary rock cleft through which Saint Thecla made her way. Maaloula is one of the rare villages still speaking Aramaic.',
                'city'                 => 'Maaloula',
                'category'             => 'historical',
                'visit_duration_hours' => 2,
                'opening_hours'        => [
                    'saturday'  => ['open' => '08:00', 'close' => '18:00'],
                    'sunday'    => ['open' => '08:00', 'close' => '18:00'],
                    'monday'    => ['open' => '08:00', 'close' => '18:00'],
                    'tuesday'   => ['open' => '08:00', 'close' => '18:00'],
                    'wednesday' => ['open' => '08:00', 'close' => '18:00'],
                    'thursday'  => ['open' => '08:00', 'close' => '18:00'],
                    'friday'    => ['open' => '08:00', 'close' => '18:00'],
                ],
            ],
            [
                'name_ar'              => 'دير مار سركيس وباخوس',
                'name_en'              => 'Mar Sarkis Monastery',
                'description_ar'       => 'دير يعود إلى القرن الرابع الميلادي، يقع على ارتفاع شاهق في جبال القلمون. يتميز بكنيسته القديمة ذات المذبح الوثني المحول إلى مسيحي، ويوفر مناظر بانورامية خلابة.',
                'description_en'       => 'A monastery dating to the 4th century AD, perched high in the Qalamoun mountains. Features an ancient church with a converted pagan altar and offers breathtaking panoramic views.',
                'city'                 => 'Maaloula',
                'category'             => 'historical',
                'visit_duration_hours' => 1,
                'opening_hours'        => [
                    'saturday'  => ['open' => '08:00', 'close' => '17:00'],
                    'sunday'    => ['open' => '08:00', 'close' => '17:00'],
                    'monday'    => ['open' => '08:00', 'close' => '17:00'],
                    'tuesday'   => ['open' => '08:00', 'close' => '17:00'],
                    'wednesday' => ['open' => '08:00', 'close' => '17:00'],
                    'thursday'  => ['open' => '08:00', 'close' => '17:00'],
                    'friday'    => ['open' => '08:00', 'close' => '17:00'],
                ],
            ],

            // ─── الزبداني (1 مكان) ───────────────────────────────
            [
                'name_ar'              => 'منتجع الزبداني',
                'name_en'              => 'Az-Zabadani Resort',
                'description_ar'       => 'منتجع طبيعي يقع على ارتفاع 1150 متر في جبال لبنان الشرقية، يشتهر بمناخه المعتدل صيفاً وتساقط الثلوج شتاءً. يحيط بالبلدة حدائق واسعة ومزارع الفاكهة والخضار.',
                'description_en'       => 'A natural resort at 1,150 meters elevation in the eastern Lebanese mountains, known for its mild summer climate and winter snowfall. Surrounded by orchards and vegetable gardens.',
                'city'                 => 'Az-Zabadani',
                'category'             => 'nature',
                'visit_duration_hours' => 3,
                'opening_hours'        => [
                    'saturday'  => ['open' => '07:00', 'close' => '22:00'],
                    'sunday'    => ['open' => '07:00', 'close' => '22:00'],
                    'monday'    => ['open' => '07:00', 'close' => '22:00'],
                    'tuesday'   => ['open' => '07:00', 'close' => '22:00'],
                    'wednesday' => ['open' => '07:00', 'close' => '22:00'],
                    'thursday'  => ['open' => '07:00', 'close' => '22:00'],
                    'friday'    => ['open' => '07:00', 'close' => '22:00'],
                ],
            ],

            // ─── بلودان (1 مكان) ─────────────────────────────────
            [
                'name_ar'              => 'جبل بلودان',
                'name_en'              => 'Bloudan Mountain',
                'description_ar'       => 'قمة جبلية تقع على ارتفاع 1600 متر، توفر مناظر خلابة على الجبال المحيطة ووادي الزبداني. تشتهر بالمطاعم والمقاهي ذات المناظر البانورامية والطبيعة الخضراء.',
                'description_en'       => 'A mountain peak at 1,600 meters elevation, offering breathtaking views of surrounding mountains and Az-Zabadani valley. Known for restaurants and cafes with panoramic views and lush nature.',
                'city'                 => 'Bloudan',
                'category'             => 'nature',
                'visit_duration_hours' => 3,
                'opening_hours'        => [
                    'saturday'  => ['open' => '07:00', 'close' => '23:00'],
                    'sunday'    => ['open' => '07:00', 'close' => '23:00'],
                    'monday'    => ['open' => '07:00', 'close' => '23:00'],
                    'tuesday'   => ['open' => '07:00', 'close' => '23:00'],
                    'wednesday' => ['open' => '07:00', 'close' => '23:00'],
                    'thursday'  => ['open' => '07:00', 'close' => '23:00'],
                    'friday'    => ['open' => '07:00', 'close' => '23:00'],
                ],
            ],

            // ─── صافيتا (2 مكان) ─────────────────────────────────
            [
                'name_ar'              => 'برج صافيتا',
                'name_en'              => 'Safita Tower',
                'description_ar'       => 'برج صليبي أبيض يعود إلى القرن الثالث عشر، يقع في وسط مدينة صافيتا. يضم في طابقه السفلي كنيسة مار ميخائيل لا تزال تمارس فيها الشعائر الدينية. يوفر من قمته منظراً بانورامياً رائعاً.',
                'description_en'       => 'A white Crusader tower from the 13th century in the center of Safita. Its lower floor contains the Church of St. Michael still in active use. From its top, a stunning panoramic view is offered.',
                'city'                 => 'Safita',
                'category'             => 'historical',
                'visit_duration_hours' => 1,
                'opening_hours'        => [
                    'saturday'  => ['open' => '09:00', 'close' => '17:00'],
                    'sunday'    => ['open' => '09:00', 'close' => '17:00'],
                    'monday'    => ['open' => '09:00', 'close' => '17:00'],
                    'tuesday'   => ['open' => '09:00', 'close' => '17:00'],
                    'wednesday' => ['open' => '09:00', 'close' => '17:00'],
                    'thursday'  => ['open' => '09:00', 'close' => '17:00'],
                    'friday'    => ['open' => '09:00', 'close' => '17:00'],
                ],
            ],
            [
                'name_ar'              => 'قلعة الحصن',
                'name_en'              => 'Krak des Chevaliers',
                'description_ar'       => 'تُعد من أكثر قلاع العصور الوسطى اكتمالاً وأفضلها حفاظاً في العالم، بناها الفرسان الصليبيون في القرن الثاني عشر. مدرجة في قائمة التراث العالمي لليونسكو عام 2006.',
                'description_en'       => 'Considered the most complete and best-preserved medieval castle in the world, built by Crusader knights in the 12th century. Listed as a UNESCO World Heritage Site in 2006.',
                'city'                 => 'Safita',
                'category'             => 'historical',
                'visit_duration_hours' => 3,
                'opening_hours'        => [
                    'saturday'  => ['open' => '09:00', 'close' => '18:00'],
                    'sunday'    => ['open' => '09:00', 'close' => '18:00'],
                    'monday'    => ['open' => '09:00', 'close' => '18:00'],
                    'tuesday'   => ['open' => '09:00', 'close' => '18:00'],
                    'wednesday' => ['open' => '09:00', 'close' => '18:00'],
                    'thursday'  => ['open' => '09:00', 'close' => '18:00'],
                    'friday'    => ['open' => '09:00', 'close' => '18:00'],
                ],
            ],

            // ─── جزيرة أرواد (2 مكان) ────────────────────────────
            [
                'name_ar'              => 'قلعة أرواد',
                'name_en'              => 'Arwad Castle',
                'description_ar'       => 'قلعة بحرية فينيقية تقع على جزيرة أرواد، الجزيرة السورية الوحيدة. بُنيت في العصور الفينيقية وأعيد بناؤها في العهد الصليبي. توفر مناظر رائعة على البحر المتوسط.',
                'description_en'       => 'A Phoenician maritime castle on Arwad Island, Syria only island. Built in the Phoenician era and rebuilt during the Crusader period. Offers stunning views of the Mediterranean Sea.',
                'city'                 => 'Arwad',
                'category'             => 'historical',
                'visit_duration_hours' => 2,
                'opening_hours'        => [
                    'saturday'  => ['open' => '09:00', 'close' => '17:00'],
                    'sunday'    => ['open' => '09:00', 'close' => '17:00'],
                    'monday'    => ['open' => '09:00', 'close' => '17:00'],
                    'tuesday'   => ['open' => '09:00', 'close' => '17:00'],
                    'wednesday' => ['open' => '09:00', 'close' => '17:00'],
                    'thursday'  => ['open' => '09:00', 'close' => '17:00'],
                    'friday'    => ['open' => '09:00', 'close' => '17:00'],
                ],
            ],
            [
                'name_ar'              => 'شاطئ جزيرة أرواد',
                'name_en'              => 'Arwad Island Beach',
                'description_ar'       => 'شواطئ بكر تحيط بجزيرة أرواد الصغيرة في البحر المتوسط، تتميز بمياهها الصافية وطابعها الأثري الفريد. يصلها القوارب من ميناء طرطوس خلال دقائق.',
                'description_en'       => 'Pristine beaches surrounding the small Arwad Island in the Mediterranean, known for crystal-clear waters and unique archaeological character. Reachable by boat from Tartus port in minutes.',
                'city'                 => 'Arwad',
                'category'             => 'beach',
                'visit_duration_hours' => 4,
                'opening_hours'        => [
                    'saturday'  => ['open' => '07:00', 'close' => '20:00'],
                    'sunday'    => ['open' => '07:00', 'close' => '20:00'],
                    'monday'    => ['open' => '07:00', 'close' => '20:00'],
                    'tuesday'   => ['open' => '07:00', 'close' => '20:00'],
                    'wednesday' => ['open' => '07:00', 'close' => '20:00'],
                    'thursday'  => ['open' => '07:00', 'close' => '20:00'],
                    'friday'    => ['open' => '07:00', 'close' => '20:00'],
                ],
            ],

            // ─── صيدنايا (1 مكان) ────────────────────────────────
            [
                'name_ar'              => 'دير سيدة صيدنايا',
                'name_en'              => 'Saidnaya Monastery',
                'description_ar'       => 'دير مسيحي يعود إلى القرن السادس الميلادي، يقع على قمة جبل مشرف على بلدة صيدنايا. يحتضن أيقونة السيدة العذراء المنسوبة إلى القديس لوقا، ويعد وجهة لحج المسيحيين.',
                'description_en'       => 'A Christian monastery dating to the 6th century AD, perched on a mountain overlooking Saidnaya. Houses an icon of the Virgin Mary attributed to Saint Luke, a pilgrimage destination for Christians.',
                'city'                 => 'Saidnaya',
                'category'             => 'historical',
                'visit_duration_hours' => 2,
                'opening_hours'        => [
                    'saturday'  => ['open' => '07:00', 'close' => '19:00'],
                    'sunday'    => ['open' => '07:00', 'close' => '19:00'],
                    'monday'    => ['open' => '07:00', 'close' => '19:00'],
                    'tuesday'   => ['open' => '07:00', 'close' => '19:00'],
                    'wednesday' => ['open' => '07:00', 'close' => '19:00'],
                    'thursday'  => ['open' => '07:00', 'close' => '19:00'],
                    'friday'    => ['open' => '07:00', 'close' => '19:00'],
                ],
            ],

            // ─── صلنفة (1 مكان) ──────────────────────────────────
            [
                'name_ar'              => 'غابات صلنفة',
                'name_en'              => 'Slunfeh Forest',
                'description_ar'       => 'محمية طبيعية تقع على ارتفاع 1200 متر في جبال اللاذقية، تغطيها غابات كثيفة من أشجار السنديان والأرز. تشتهر بمناخها البارد الرطب ومناظرها الطبيعية الخلابة.',
                'description_en'       => 'A nature reserve at 1,200 meters in the Latakia mountains, covered with dense oak and cedar forests. Known for its cool humid climate and stunning natural scenery.',
                'city'                 => 'Slunfeh',
                'category'             => 'nature',
                'visit_duration_hours' => 4,
                'opening_hours'        => [
                    'saturday'  => ['open' => '07:00', 'close' => '19:00'],
                    'sunday'    => ['open' => '07:00', 'close' => '19:00'],
                    'monday'    => ['open' => '07:00', 'close' => '19:00'],
                    'tuesday'   => ['open' => '07:00', 'close' => '19:00'],
                    'wednesday' => ['open' => '07:00', 'close' => '19:00'],
                    'thursday'  => ['open' => '07:00', 'close' => '19:00'],
                    'friday'    => ['open' => '07:00', 'close' => '19:00'],
                ],
            ],

            // ─── مصياف (1 مكان) ──────────────────────────────────
            [
                'name_ar'              => 'قلعة مصياف',
                'name_en'              => 'Masyaf Castle',
                'description_ar'       => 'قلعة عربية تاريخية اشتُهرت بكونها معقل الحشاشين بقيادة الشيخ راشد الدين سنان في القرن الثاني عشر. تقع على ربوة مشرفة على مدينة مصياف وسهل الغاب.',
                'description_en'       => 'A historic Arab castle famous as the stronghold of the Assassins led by Sheikh Rashid al-Din Sinan in the 12th century. Perched on a hill overlooking Masyaf city and the Ghab plain.',
                'city'                 => 'Masyaf',
                'category'             => 'historical',
                'visit_duration_hours' => 2,
                'opening_hours'        => [
                    'saturday'  => ['open' => '09:00', 'close' => '17:00'],
                    'sunday'    => ['open' => '09:00', 'close' => '17:00'],
                    'monday'    => ['open' => '09:00', 'close' => '17:00'],
                    'tuesday'   => ['open' => '09:00', 'close' => '17:00'],
                    'wednesday' => ['open' => '09:00', 'close' => '17:00'],
                    'thursday'  => ['open' => '09:00', 'close' => '17:00'],
                    'friday'    => null,
                ],
            ],

            // ─── شهبا (1 مكان) ───────────────────────────────────
            [
                'name_ar'              => 'آثار شهبا',
                'name_en'              => 'Shahba Ruins',
                'description_ar'       => 'مدينة رومانية بُنيت في القرن الثالث الميلادي بأمر الإمبراطور فيليب العربي الذي وُلد فيها. تضم معبداً ومسرحاً وحمامات رومانية محفوظة بشكل جيد.',
                'description_en'       => 'A Roman city built in the 3rd century AD by order of Emperor Philip the Arab who was born there. Contains a well-preserved temple, theatre, and Roman baths.',
                'city'                 => 'Shahba',
                'category'             => 'historical',
                'visit_duration_hours' => 2,
                'opening_hours'        => [
                    'saturday'  => ['open' => '08:00', 'close' => '17:00'],
                    'sunday'    => ['open' => '08:00', 'close' => '17:00'],
                    'monday'    => ['open' => '08:00', 'close' => '17:00'],
                    'tuesday'   => ['open' => '08:00', 'close' => '17:00'],
                    'wednesday' => ['open' => '08:00', 'close' => '17:00'],
                    'thursday'  => ['open' => '08:00', 'close' => '17:00'],
                    'friday'    => null,
                ],
            ],
        ];

        // أنشئ الأماكن
        foreach ($places as $place) {
            $cityName = $place['city'];
            unset($place['city']);

            if (isset($cityMap[$cityName])) {
                Place::firstOrCreate(
                    ['name_en' => $place['name_en']],
                    [
                        ...$place,
                        'city_id'    => $cityMap[$cityName],
                        'created_by' => $admin->id,
                        'avg_rating' => 0.00,
                        'opening_hours' => $place['opening_hours'],
                    ]
                );
            }
        }

        $this->command->info('✅ Syria cities and places seeded successfully!');
        $this->command->info('   Cities: ' . count($cities));
        $this->command->info('   Places: ' . count($places));
    }
}
