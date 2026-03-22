export interface TarotCard {
  id: string;
  name: string;
  number: number;
  arcana: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  image: string;
  description: string;
  upright: string[];
  reversed: string[];
  keywords: string[];
  element?: string;
  zodiac?: string;
  yesNo: 'yes' | 'no' | 'maybe';
  slug: string;
  detailedMeaning: string;
}

// Local card images in public/images/cards/{slug}.jpg
function cardImg(slug: string): string {
  return `/images/cards/${slug}.jpg`;
}

export const tarotCards: TarotCard[] = [
  // ===== MAJOR ARCANA =====
  {
    id: 'major-0', name: 'The Fool', number: 0, arcana: 'major',
    image: cardImg('the-fool'),
    description: 'Bước khởi đầu mới, sự tự do và tiềm năng vô hạn. Kẻ Khờ bước đi không sợ hãi, mang theo niềm tin vào cuộc sống.',
    upright: ['Khởi đầu mới', 'Tự do', 'Ngây thơ', 'Phiêu lưu', 'Tiềm năng'],
    reversed: ['Liều lĩnh', 'Thiếu suy nghĩ', 'Bất cẩn', 'Mạo hiểm'],
    keywords: ['freedom', 'innocence', 'adventure', 'new beginning'],
    element: 'Air', zodiac: 'Uranus', yesNo: 'yes', slug: 'the-fool',
    detailedMeaning: 'The Fool tượng trưng cho sự khởi đầu mới đầy hứng khởi. Bạn đang đứng trước ngưỡng cửa của một hành trình mới — hãy tin vào trực giác và bước đi mà không cần biết trước đích đến.',
  },
  {
    id: 'major-1', name: 'The Magician', number: 1, arcana: 'major',
    image: cardImg('the-magician'),
    description: 'Sức mạnh sáng tạo, ý chí mạnh mẽ và khả năng biến ý tưởng thành hiện thực.',
    upright: ['Ý chí', 'Sáng tạo', 'Tài năng', 'Tự tin', 'Hành động'],
    reversed: ['Lừa dối', 'Thiếu tập trung', 'Lãng phí tài năng'],
    keywords: ['willpower', 'manifestation', 'skill', 'resourcefulness'],
    element: 'Air', zodiac: 'Mercury', yesNo: 'yes', slug: 'the-magician',
    detailedMeaning: 'The Magician cho thấy bạn có đầy đủ công cụ và khả năng để đạt được mục tiêu. Mọi nguồn lực đều trong tay bạn — hãy hành động ngay.',
  },
  {
    id: 'major-2', name: 'The High Priestess', number: 2, arcana: 'major',
    image: cardImg('the-high-priestess'),
    description: 'Trực giác, bí ẩn và sự kết nối với tiềm thức. Hãy lắng nghe tiếng nói bên trong.',
    upright: ['Trực giác', 'Bí ẩn', 'Tiềm thức', 'Sự thông thái', 'Tĩnh lặng'],
    reversed: ['Bí mật', 'Bỏ qua trực giác', 'Bề ngoài che đậy'],
    keywords: ['intuition', 'mystery', 'subconscious', 'inner wisdom'],
    element: 'Water', zodiac: 'Moon', yesNo: 'maybe', slug: 'the-high-priestess',
    detailedMeaning: 'The High Priestess nhắc nhở bạn hãy lắng nghe trực giác. Câu trả lời không ở bên ngoài mà nằm sâu trong tiềm thức của bạn.',
  },
  {
    id: 'major-3', name: 'The Empress', number: 3, arcana: 'major',
    image: cardImg('the-empress'),
    description: 'Sự phong phú, nuôi dưỡng và tình yêu vô điều kiện. Nữ hoàng là biểu tượng của sự sáng tạo và dồi dào.',
    upright: ['Phong phú', 'Nuôi dưỡng', 'Sáng tạo', 'Tình yêu', 'Thiên nhiên'],
    reversed: ['Phụ thuộc', 'Sáng tạo bị chặn', 'Thiếu chăm sóc bản thân'],
    keywords: ['abundance', 'nurturing', 'creativity', 'femininity'],
    element: 'Earth', zodiac: 'Venus', yesNo: 'yes', slug: 'the-empress',
    detailedMeaning: 'The Empress mang đến năng lượng phong phú và nuôi dưỡng. Đây là thời điểm tuyệt vời cho sáng tạo, tình yêu và chăm sóc bản thân.',
  },
  {
    id: 'major-4', name: 'The Emperor', number: 4, arcana: 'major',
    image: cardImg('the-emperor'),
    description: 'Quyền lực, cấu trúc và sự ổn định. Hoàng Đế đại diện cho kỷ luật và khả năng lãnh đạo.',
    upright: ['Quyền lực', 'Cấu trúc', 'Ổn định', 'Lãnh đạo', 'Kỷ luật'],
    reversed: ['Kiểm soát quá mức', 'Cứng nhắc', 'Độc đoán'],
    keywords: ['authority', 'structure', 'stability', 'leadership'],
    element: 'Fire', zodiac: 'Aries', yesNo: 'yes', slug: 'the-emperor',
    detailedMeaning: 'The Emperor khuyên bạn thiết lập trật tự và kỷ luật. Hãy lấy lại quyền kiểm soát cuộc sống bằng tư duy logic và kế hoạch rõ ràng.',
  },
  {
    id: 'major-5', name: 'The Hierophant', number: 5, arcana: 'major',
    image: cardImg('the-hierophant'),
    description: 'Truyền thống, đạo đức và sự hướng dẫn tâm linh. Giáo Hoàng là người thầy dẫn dắt.',
    upright: ['Truyền thống', 'Đạo đức', 'Hướng dẫn', 'Giáo dục', 'Niềm tin'],
    reversed: ['Nổi loạn', 'Phá vỡ quy tắc', 'Tự do tư tưởng'],
    keywords: ['tradition', 'conformity', 'mentorship', 'spiritual guidance'],
    element: 'Earth', zodiac: 'Taurus', yesNo: 'maybe', slug: 'the-hierophant',
    detailedMeaning: 'The Hierophant gợi ý bạn tìm kiếm sự hướng dẫn từ người thầy hoặc truyền thống. Đôi khi câu trả lời nằm trong những giá trị đã được kiểm chứng.',
  },
  {
    id: 'major-6', name: 'The Lovers', number: 6, arcana: 'major',
    image: cardImg('the-lovers'),
    description: 'Tình yêu, sự hòa hợp và những lựa chọn quan trọng trong mối quan hệ.',
    upright: ['Tình yêu', 'Hòa hợp', 'Lựa chọn', 'Kết nối', 'Đam mê'],
    reversed: ['Bất hòa', 'Lựa chọn sai', 'Mất cân bằng'],
    keywords: ['love', 'harmony', 'relationships', 'choices'],
    element: 'Air', zodiac: 'Gemini', yesNo: 'yes', slug: 'the-lovers',
    detailedMeaning: 'The Lovers cho thấy một mối quan hệ sâu sắc hoặc một quyết định quan trọng. Hãy lắng nghe cả trái tim và lý trí.',
  },
  {
    id: 'major-7', name: 'The Chariot', number: 7, arcana: 'major',
    image: cardImg('the-chariot'),
    description: 'Chiến thắng, quyết tâm và sức mạnh ý chí. Cỗ Xe lao về phía trước không gì cản nổi.',
    upright: ['Chiến thắng', 'Quyết tâm', 'Kiểm soát', 'Tham vọng', 'Ý chí'],
    reversed: ['Thiếu phương hướng', 'Hung hăng', 'Mất kiểm soát'],
    keywords: ['victory', 'determination', 'willpower', 'ambition'],
    element: 'Water', zodiac: 'Cancer', yesNo: 'yes', slug: 'the-chariot',
    detailedMeaning: 'The Chariot là dấu hiệu chiến thắng. Bạn có đủ sức mạnh và quyết tâm để vượt qua mọi trở ngại — hãy tiến về phía trước.',
  },
  {
    id: 'major-8', name: 'Strength', number: 8, arcana: 'major',
    image: cardImg('strength'),
    description: 'Sức mạnh nội tại, lòng dũng cảm và sự kiên nhẫn. Thuần hóa bản năng bằng tình yêu.',
    upright: ['Sức mạnh', 'Dũng cảm', 'Kiên nhẫn', 'Đồng cảm', 'Tự tin'],
    reversed: ['Tự ti', 'Yếu đuối', 'Thiếu kiên nhẫn'],
    keywords: ['strength', 'courage', 'patience', 'compassion'],
    element: 'Fire', zodiac: 'Leo', yesNo: 'yes', slug: 'strength',
    detailedMeaning: 'Strength nhắc nhở sức mạnh thật sự đến từ bên trong. Không cần dùng vũ lực — hãy dùng lòng kiên nhẫn và sự đồng cảm.',
  },
  {
    id: 'major-9', name: 'The Hermit', number: 9, arcana: 'major',
    image: cardImg('the-hermit'),
    description: 'Sự cô đơn có ý nghĩa, tìm kiếm sự thật bên trong và sự hướng dẫn từ nội tâm.',
    upright: ['Nội tâm', 'Cô đơn', 'Tìm kiếm', 'Sự thật', 'Chiêm nghiệm'],
    reversed: ['Cô lập', 'Từ chối giúp đỡ', 'Lạc lõng'],
    keywords: ['solitude', 'introspection', 'wisdom', 'inner guidance'],
    element: 'Earth', zodiac: 'Virgo', yesNo: 'maybe', slug: 'the-hermit',
    detailedMeaning: 'The Hermit khuyên bạn dành thời gian một mình để suy ngẫm. Câu trả lời sẽ đến khi bạn sẵn sàng lắng nghe chính mình.',
  },
  {
    id: 'major-10', name: 'Wheel of Fortune', number: 10, arcana: 'major',
    image: cardImg('wheel-of-fortune'),
    description: 'Vận mệnh, chu kỳ và sự thay đổi. Bánh xe quay không ngừng — mọi thứ đều thay đổi.',
    upright: ['Vận may', 'Thay đổi', 'Chu kỳ', 'Cơ hội', 'Xoay chuyển'],
    reversed: ['Xui xẻo', 'Kháng cự thay đổi', 'Mất kiểm soát'],
    keywords: ['destiny', 'luck', 'cycles', 'turning point'],
    element: 'Fire', zodiac: 'Jupiter', yesNo: 'yes', slug: 'wheel-of-fortune',
    detailedMeaning: 'Wheel of Fortune báo hiệu sự thay đổi lớn sắp đến. Hãy sẵn sàng đón nhận — vận may đang quay về phía bạn.',
  },
  {
    id: 'major-11', name: 'Justice', number: 11, arcana: 'major',
    image: cardImg('justice'),
    description: 'Công lý, sự thật và trách nhiệm. Mọi hành động đều có hệ quả tương xứng.',
    upright: ['Công lý', 'Sự thật', 'Cân bằng', 'Trách nhiệm', 'Luật nhân quả'],
    reversed: ['Bất công', 'Thiên vị', 'Trốn tránh trách nhiệm'],
    keywords: ['justice', 'truth', 'fairness', 'karma'],
    element: 'Air', zodiac: 'Libra', yesNo: 'maybe', slug: 'justice',
    detailedMeaning: 'Justice yêu cầu sự trung thực và chịu trách nhiệm. Kết quả bạn nhận được phản ánh đúng những gì bạn đã gieo.',
  },
  {
    id: 'major-12', name: 'The Hanged Man', number: 12, arcana: 'major',
    image: cardImg('the-hanged-man'),
    description: 'Sự hy sinh, buông bỏ và nhìn nhận từ góc độ mới. Đôi khi dừng lại là tiến về phía trước.',
    upright: ['Buông bỏ', 'Hy sinh', 'Góc nhìn mới', 'Kiên nhẫn', 'Chấp nhận'],
    reversed: ['Trì hoãn', 'Cố chấp', 'Không chịu thay đổi'],
    keywords: ['surrender', 'sacrifice', 'new perspective', 'patience'],
    element: 'Water', zodiac: 'Neptune', yesNo: 'maybe', slug: 'the-hanged-man',
    detailedMeaning: 'The Hanged Man nhắc bạn hãy buông bỏ và nhìn vấn đề từ góc khác. Đôi khi sự dừng lại mang đến giác ngộ bất ngờ.',
  },
  {
    id: 'major-13', name: 'Death', number: 13, arcana: 'major',
    image: cardImg('death'),
    description: 'Sự kết thúc và khởi đầu mới. Death không phải là kết thúc mà là sự chuyển hóa cần thiết.',
    upright: ['Chuyển hóa', 'Kết thúc', 'Khởi đầu mới', 'Thay đổi', 'Giải phóng'],
    reversed: ['Sợ thay đổi', 'Bám víu quá khứ', 'Trì trệ'],
    keywords: ['transformation', 'ending', 'rebirth', 'release'],
    element: 'Water', zodiac: 'Scorpio', yesNo: 'no', slug: 'death',
    detailedMeaning: 'Death không đáng sợ — nó báo hiệu sự chuyển hóa. Hãy buông bỏ những gì không còn phục vụ bạn để mở đường cho cái mới.',
  },
  {
    id: 'major-14', name: 'Temperance', number: 14, arcana: 'major',
    image: cardImg('temperance'),
    description: 'Sự cân bằng, ôn hòa và kiên nhẫn. Hòa trộn các yếu tố đối lập để tạo nên sự hài hòa.',
    upright: ['Cân bằng', 'Ôn hòa', 'Kiên nhẫn', 'Hài hòa', 'Chữa lành'],
    reversed: ['Mất cân bằng', 'Thái quá', 'Thiếu kiên nhẫn'],
    keywords: ['balance', 'moderation', 'patience', 'harmony'],
    element: 'Fire', zodiac: 'Sagittarius', yesNo: 'yes', slug: 'temperance',
    detailedMeaning: 'Temperance khuyên bạn giữ sự cân bằng trong mọi việc. Đừng vội vàng — kết quả tốt nhất đến từ sự kiên nhẫn và hài hòa.',
  },
  {
    id: 'major-15', name: 'The Devil', number: 15, arcana: 'major',
    image: cardImg('the-devil'),
    description: 'Sự ràng buộc, cám dỗ và bóng tối. Nhận diện những xiềng xích tự nguyện đeo vào.',
    upright: ['Ràng buộc', 'Cám dỗ', 'Nghiện ngập', 'Bóng tối', 'Ham muốn'],
    reversed: ['Giải phóng', 'Thoát khỏi cám dỗ', 'Nhận thức'],
    keywords: ['bondage', 'temptation', 'shadow self', 'attachment'],
    element: 'Earth', zodiac: 'Capricorn', yesNo: 'no', slug: 'the-devil',
    detailedMeaning: 'The Devil cảnh báo bạn đang bị ràng buộc bởi thói quen xấu hoặc mối quan hệ độc hại. Hãy nhận ra rằng bạn có sức mạnh để tự giải phóng.',
  },
  {
    id: 'major-16', name: 'The Tower', number: 16, arcana: 'major',
    image: cardImg('the-tower'),
    description: 'Sự sụp đổ, biến động lớn và sự thức tỉnh bất ngờ. Phá hủy để xây dựng lại.',
    upright: ['Sụp đổ', 'Biến động', 'Thức tỉnh', 'Giải phóng', 'Sự thật'],
    reversed: ['Trì hoãn thay đổi', 'Sợ hãi', 'Tránh né'],
    keywords: ['upheaval', 'sudden change', 'revelation', 'awakening'],
    element: 'Fire', zodiac: 'Mars', yesNo: 'no', slug: 'the-tower',
    detailedMeaning: 'The Tower mang đến sự sụp đổ đột ngột nhưng cần thiết. Những gì xây trên nền tảng sai sẽ phải sụp để bạn xây lại vững hơn.',
  },
  {
    id: 'major-17', name: 'The Star', number: 17, arcana: 'major',
    image: cardImg('the-star'),
    description: 'Hy vọng, cảm hứng và sự chữa lành. Sau cơn bão, ngôi sao luôn tỏa sáng.',
    upright: ['Hy vọng', 'Cảm hứng', 'Chữa lành', 'Bình yên', 'Tái sinh'],
    reversed: ['Mất hy vọng', 'Thất vọng', 'Nghi ngờ bản thân'],
    keywords: ['hope', 'inspiration', 'renewal', 'serenity'],
    element: 'Air', zodiac: 'Aquarius', yesNo: 'yes', slug: 'the-star',
    detailedMeaning: 'The Star mang đến hy vọng và sự chữa lành sau những giai đoạn khó khăn. Hãy tin tưởng vào tương lai tươi sáng.',
  },
  {
    id: 'major-18', name: 'The Moon', number: 18, arcana: 'major',
    image: cardImg('the-moon'),
    description: 'Ảo tưởng, nỗi sợ và tiềm thức. Mặt trăng soi sáng những gì ẩn giấu trong bóng tối.',
    upright: ['Ảo tưởng', 'Nỗi sợ', 'Tiềm thức', 'Bất an', 'Trực giác'],
    reversed: ['Sáng tỏ', 'Vượt qua sợ hãi', 'Hiểu lầm được giải'],
    keywords: ['illusion', 'fear', 'subconscious', 'intuition'],
    element: 'Water', zodiac: 'Pisces', yesNo: 'no', slug: 'the-moon',
    detailedMeaning: 'The Moon cảnh báo bạn đang bị ảnh hưởng bởi ảo tưởng hoặc nỗi sợ vô hình. Hãy tin vào trực giác để tìm đường qua bóng tối.',
  },
  {
    id: 'major-19', name: 'The Sun', number: 19, arcana: 'major',
    image: cardImg('the-sun'),
    description: 'Niềm vui, thành công và sự rạng rỡ. Mặt trời chiếu sáng mọi ngóc ngách.',
    upright: ['Niềm vui', 'Thành công', 'Hạnh phúc', 'Năng lượng', 'Sáng tỏ'],
    reversed: ['Quá lạc quan', 'Chậm trễ', 'Thiếu rõ ràng'],
    keywords: ['joy', 'success', 'vitality', 'positivity'],
    element: 'Fire', zodiac: 'Sun', yesNo: 'yes', slug: 'the-sun',
    detailedMeaning: 'The Sun là lá bài tích cực nhất! Niềm vui, thành công và hạnh phúc đang chờ đón bạn. Mọi thứ sẽ sáng tỏ.',
  },
  {
    id: 'major-20', name: 'Judgement', number: 20, arcana: 'major',
    image: cardImg('judgement'),
    description: 'Sự phán xét, hồi sinh và tiếng gọi cao hơn. Thời điểm đánh giá lại và bước lên.',
    upright: ['Phán xét', 'Hồi sinh', 'Giác ngộ', 'Tiếng gọi', 'Tha thứ'],
    reversed: ['Tự phán xét', 'Nghi ngờ', 'Bỏ lỡ cơ hội'],
    keywords: ['judgement', 'rebirth', 'absolution', 'calling'],
    element: 'Fire', zodiac: 'Pluto', yesNo: 'yes', slug: 'judgement',
    detailedMeaning: 'Judgement kêu gọi bạn nhìn lại quá khứ, tha thứ cho bản thân và đón nhận sự tái sinh. Một phiên bản tốt hơn đang chờ bạn.',
  },
  {
    id: 'major-21', name: 'The World', number: 21, arcana: 'major',
    image: cardImg('the-world'),
    description: 'Sự hoàn thành, viên mãn và tích hợp. Chu kỳ đã xong — bạn đã đạt được mục tiêu.',
    upright: ['Hoàn thành', 'Viên mãn', 'Tích hợp', 'Thành tựu', 'Du hành'],
    reversed: ['Chưa hoàn thành', 'Thiếu kết thúc', 'Trì hoãn'],
    keywords: ['completion', 'integration', 'accomplishment', 'travel'],
    element: 'Earth', zodiac: 'Saturn', yesNo: 'yes', slug: 'the-world',
    detailedMeaning: 'The World đánh dấu sự hoàn thành viên mãn. Bạn đã trải qua toàn bộ hành trình và giờ đã sẵn sàng cho chương mới.',
  },

  // ===== MINOR ARCANA — WANDS =====
  ...generateMinorArcana('wands', 'Fire', [
    { name: 'Ace of Wands', desc: 'Nguồn cảm hứng mới, sáng tạo bùng nổ.', up: ['Cảm hứng', 'Sáng tạo', 'Tiềm năng'], rev: ['Chậm trễ', 'Thiếu động lực'], img: '1/11/Wands01.jpg' },
    { name: 'Two of Wands', desc: 'Lập kế hoạch, tầm nhìn xa và quyết định.', up: ['Lập kế hoạch', 'Tầm nhìn', 'Quyết định'], rev: ['Sợ rủi ro', 'Thiếu kế hoạch'], img: '0/0f/Wands02.jpg' },
    { name: 'Three of Wands', desc: 'Mở rộng, tiến bộ và nhìn về tương lai.', up: ['Mở rộng', 'Tiến bộ', 'Tầm nhìn'], rev: ['Chậm tiến', 'Thất vọng'], img: 'f/ff/Wands03.jpg' },
    { name: 'Four of Wands', desc: 'Lễ hội, ổn định và niềm vui gia đình.', up: ['Lễ hội', 'Ổn định', 'Hạnh phúc'], rev: ['Bất ổn', 'Xung đột gia đình'], img: 'a/a4/Wands04.jpg' },
    { name: 'Five of Wands', desc: 'Cạnh tranh, xung đột và thử thách.', up: ['Cạnh tranh', 'Xung đột', 'Thử thách'], rev: ['Hòa giải', 'Tránh xung đột'], img: '9/9d/Wands05.jpg' },
    { name: 'Six of Wands', desc: 'Chiến thắng, vinh quang và sự công nhận.', up: ['Chiến thắng', 'Vinh quang', 'Công nhận'], rev: ['Thất bại', 'Kiêu ngạo'], img: '3/3b/Wands06.jpg' },
    { name: 'Seven of Wands', desc: 'Phòng thủ, kiên trì và bảo vệ lập trường.', up: ['Phòng thủ', 'Kiên trì', 'Can đảm'], rev: ['Đầu hàng', 'Quá tải'], img: 'e/e4/Wands07.jpg' },
    { name: 'Eight of Wands', desc: 'Tốc độ, hành động nhanh và bước tiến.', up: ['Tốc độ', 'Hành động', 'Tiến triển'], rev: ['Chậm trễ', 'Hỗn loạn'], img: '6/6a/Wands08.jpg' },
    { name: 'Nine of Wands', desc: 'Kiên cường, bền bỉ và không bỏ cuộc.', up: ['Kiên cường', 'Bền bỉ', 'Dũng cảm'], rev: ['Kiệt sức', 'Đa nghi'], img: '4/4d/Tarot_Nine_of_Wands.jpg' },
    { name: 'Ten of Wands', desc: 'Gánh nặng, trách nhiệm quá lớn.', up: ['Gánh nặng', 'Trách nhiệm', 'Quá tải'], rev: ['Buông bỏ', 'Chia sẻ gánh nặng'], img: '0/0b/Wands10.jpg' },
    { name: 'Page of Wands', desc: 'Nhiệt huyết, khám phá và ý tưởng mới.', up: ['Nhiệt huyết', 'Khám phá', 'Sáng tạo'], rev: ['Thiếu định hướng', 'Nóng vội'], img: '6/6a/Wands11.jpg' },
    { name: 'Knight of Wands', desc: 'Đam mê, phiêu lưu và hành động quyết liệt.', up: ['Đam mê', 'Phiêu lưu', 'Quyết liệt'], rev: ['Nóng giận', 'Vội vàng'], img: '1/16/Wands12.jpg' },
    { name: 'Queen of Wands', desc: 'Tự tin, quyến rũ và sáng tạo mạnh mẽ.', up: ['Tự tin', 'Quyến rũ', 'Sáng tạo'], rev: ['Đố kỵ', 'Ích kỷ'], img: '0/0d/Wands13.jpg' },
    { name: 'King of Wands', desc: 'Lãnh đạo, tầm nhìn và nghị lực phi thường.', up: ['Lãnh đạo', 'Tầm nhìn', 'Nghị lực'], rev: ['Độc đoán', 'Nóng nảy'], img: 'c/ce/Wands14.jpg' },
  ]),

  // ===== MINOR ARCANA — CUPS =====
  ...generateMinorArcana('cups', 'Water', [
    { name: 'Ace of Cups', desc: 'Tình yêu mới, cảm xúc tràn đầy.', up: ['Tình yêu mới', 'Cảm xúc', 'Hạnh phúc'], rev: ['Trống rỗng', 'Thiếu kết nối'], img: '3/36/Cups01.jpg' },
    { name: 'Two of Cups', desc: 'Kết nối, đối tác và tình yêu hòa hợp.', up: ['Kết nối', 'Đối tác', 'Hòa hợp'], rev: ['Bất hòa', 'Chia ly'], img: 'f/f8/Cups02.jpg' },
    { name: 'Three of Cups', desc: 'Ăn mừng, tình bạn và niềm vui chia sẻ.', up: ['Ăn mừng', 'Tình bạn', 'Niềm vui'], rev: ['Phản bội', 'Cô đơn'], img: '7/7a/Cups03.jpg' },
    { name: 'Four of Cups', desc: 'Chán nản, bỏ lỡ cơ hội vì thờ ơ.', up: ['Suy ngẫm', 'Thờ ơ', 'Chán nản'], rev: ['Nhận ra cơ hội', 'Tỉnh thức'], img: '3/35/Cups04.jpg' },
    { name: 'Five of Cups', desc: 'Đau buồn, mất mát nhưng vẫn còn hy vọng.', up: ['Đau buồn', 'Mất mát', 'Hối tiếc'], rev: ['Tha thứ', 'Tiến về phía trước'], img: 'd/d7/Cups05.jpg' },
    { name: 'Six of Cups', desc: 'Ký ức, tuổi thơ và sự hoài niệm.', up: ['Hoài niệm', 'Tuổi thơ', 'Hào phóng'], rev: ['Bám víu quá khứ', 'Chưa trưởng thành'], img: '1/17/Cups06.jpg' },
    { name: 'Seven of Cups', desc: 'Ảo tưởng, nhiều lựa chọn và mơ mộng.', up: ['Ảo tưởng', 'Lựa chọn', 'Mơ mộng'], rev: ['Tỉnh thức', 'Rõ ràng hơn'], img: 'a/ae/Cups07.jpg' },
    { name: 'Eight of Cups', desc: 'Ra đi, buông bỏ để tìm ý nghĩa sâu hơn.', up: ['Ra đi', 'Buông bỏ', 'Tìm kiếm'], rev: ['Sợ thay đổi', 'Bám víu'], img: '6/60/Cups08.jpg' },
    { name: 'Nine of Cups', desc: 'Thỏa mãn, ước mơ thành hiện thực.', up: ['Thỏa mãn', 'Ước mơ', 'Hạnh phúc'], rev: ['Tham lam', 'Chưa đủ'], img: '2/24/Cups09.jpg' },
    { name: 'Ten of Cups', desc: 'Hạnh phúc gia đình, tình yêu viên mãn.', up: ['Hạnh phúc', 'Gia đình', 'Viên mãn'], rev: ['Xung đột gia đình', 'Mất hài hòa'], img: '8/84/Cups10.jpg' },
    { name: 'Page of Cups', desc: 'Sáng tạo, tin nhắn tình cảm, nhạy cảm.', up: ['Sáng tạo', 'Tin nhắn', 'Nhạy cảm'], rev: ['Không thực tế', 'Cảm xúc bất ổn'], img: 'a/ad/Cups11.jpg' },
    { name: 'Knight of Cups', desc: 'Lãng mạn, quyến rũ và theo đuổi giấc mơ.', up: ['Lãng mạn', 'Quyến rũ', 'Giấc mơ'], rev: ['Ảo tưởng', 'Thiếu cam kết'], img: 'f/fa/Cups12.jpg' },
    { name: 'Queen of Cups', desc: 'Đồng cảm, trực giác và sự nuôi dưỡng.', up: ['Đồng cảm', 'Trực giác', 'Nuôi dưỡng'], rev: ['Quá nhạy cảm', 'Mất cân bằng cảm xúc'], img: '6/62/Cups13.jpg' },
    { name: 'King of Cups', desc: 'Điểm tĩnh cảm xúc, khôn ngoan và bao dung.', up: ['Điểm tĩnh', 'Khôn ngoan', 'Bao dung'], rev: ['Lạnh lùng', 'Kiểm soát cảm xúc'], img: '0/04/Cups14.jpg' },
  ]),

  // ===== MINOR ARCANA — SWORDS =====
  ...generateMinorArcana('swords', 'Air', [
    { name: 'Ace of Swords', desc: 'Sự thật, sáng suốt và bước đột phá.', up: ['Sự thật', 'Sáng suốt', 'Đột phá'], rev: ['Hỗn loạn', 'Thiếu rõ ràng'], img: 'e/e7/Swords01.jpg' },
    { name: 'Two of Swords', desc: 'Lưỡng lự, bế tắc và cần quyết định.', up: ['Lưỡng lự', 'Bế tắc', 'Cân nhắc'], rev: ['Quá tải thông tin', 'Quyết định vội'], img: '9/9e/Swords02.jpg' },
    { name: 'Three of Swords', desc: 'Đau lòng, chia ly và nỗi buồn sâu sắc.', up: ['Đau lòng', 'Chia ly', 'Buồn'], rev: ['Hồi phục', 'Tha thứ'], img: '0/02/Swords03.jpg' },
    { name: 'Four of Swords', desc: 'Nghỉ ngơi, phục hồi và suy ngẫm.', up: ['Nghỉ ngơi', 'Phục hồi', 'Tĩnh tâm'], rev: ['Kiệt sức', 'Không chịu nghỉ'], img: 'b/bf/Swords04.jpg' },
    { name: 'Five of Swords', desc: 'Xung đột, thắng thua và sự căng thẳng.', up: ['Xung đột', 'Thắng-thua', 'Căng thẳng'], rev: ['Hàn gắn', 'Hòa giải'], img: '2/23/Swords05.jpg' },
    { name: 'Six of Swords', desc: 'Chuyển đổi, rời đi và tìm bình yên.', up: ['Chuyển đổi', 'Rời đi', 'Bình yên'], rev: ['Kháng cự', 'Không buông được'], img: '2/29/Swords06.jpg' },
    { name: 'Seven of Swords', desc: 'Lén lút, chiến lược và sự dối trá.', up: ['Chiến lược', 'Lén lút', 'Tránh né'], rev: ['Bị phơi bày', 'Hối hận'], img: '3/34/Swords07.jpg' },
    { name: 'Eight of Swords', desc: 'Mắc kẹt, hạn chế tự áp đặt và bất lực.', up: ['Mắc kẹt', 'Hạn chế', 'Bất lực'], rev: ['Giải phóng', 'Nhìn thấy lối ra'], img: 'a/a7/Swords08.jpg' },
    { name: 'Nine of Swords', desc: 'Lo âu, mất ngủ và nỗi sợ bên trong.', up: ['Lo âu', 'Mất ngủ', 'Nỗi sợ'], rev: ['Vượt qua lo âu', 'Hy vọng'], img: '2/2f/Swords09.jpg' },
    { name: 'Ten of Swords', desc: 'Kết thúc đau đớn nhưng là đáy sâu nhất.', up: ['Kết thúc', 'Đau đớn', 'Chạm đáy'], rev: ['Hồi sinh', 'Thoát khỏi đau khổ'], img: 'd/d4/Swords10.jpg' },
    { name: 'Page of Swords', desc: 'Tò mò, nhạy bén và luôn cảnh giác.', up: ['Tò mò', 'Nhạy bén', 'Cảnh giác'], rev: ['Lắm lời', 'Hấp tấp'], img: '4/4c/Swords11.jpg' },
    { name: 'Knight of Swords', desc: 'Hành động nhanh, quyết đoán và mạnh mẽ.', up: ['Quyết đoán', 'Nhanh nhẹn', 'Mạnh mẽ'], rev: ['Vội vàng', 'Thiếu suy nghĩ'], img: 'b/b0/Swords12.jpg' },
    { name: 'Queen of Swords', desc: 'Thông minh, độc lập và sắc bén.', up: ['Thông minh', 'Độc lập', 'Sắc bén'], rev: ['Lạnh lùng', 'Phê phán'], img: 'd/d4/Swords13.jpg' },
    { name: 'King of Swords', desc: 'Logic, công bằng và tư duy chiến lược.', up: ['Logic', 'Công bằng', 'Chiến lược'], rev: ['Độc tài', 'Thiếu đồng cảm'], img: '3/33/Swords14.jpg' },
  ]),

  // ===== MINOR ARCANA — PENTACLES =====
  ...generateMinorArcana('pentacles', 'Earth', [
    { name: 'Ace of Pentacles', desc: 'Cơ hội tài chính, khởi đầu thịnh vượng.', up: ['Cơ hội', 'Thịnh vượng', 'Khởi đầu'], rev: ['Bỏ lỡ cơ hội', 'Lãng phí'], img: 'f/fd/Pents01.jpg' },
    { name: 'Two of Pentacles', desc: 'Cân bằng, linh hoạt và quản lý nhiều việc.', up: ['Cân bằng', 'Linh hoạt', 'Quản lý'], rev: ['Quá tải', 'Mất cân bằng'], img: '9/9f/Pents02.jpg' },
    { name: 'Three of Pentacles', desc: 'Hợp tác, kỹ năng và dự án chung.', up: ['Hợp tác', 'Kỹ năng', 'Teamwork'], rev: ['Bất đồng', 'Chất lượng kém'], img: '4/42/Pents03.jpg' },
    { name: 'Four of Pentacles', desc: 'An toàn tài chính nhưng dễ keo kiệt.', up: ['An toàn', 'Tiết kiệm', 'Ổn định'], rev: ['Keo kiệt', 'Tham lam'], img: '3/35/Pents04.jpg' },
    { name: 'Five of Pentacles', desc: 'Khó khăn tài chính, cô đơn nhưng có hỗ trợ.', up: ['Khó khăn', 'Cô đơn', 'Thiếu thốn'], rev: ['Hồi phục', 'Tìm được hỗ trợ'], img: '9/96/Pents05.jpg' },
    { name: 'Six of Pentacles', desc: 'Cho đi, nhận lại và sự hào phóng.', up: ['Hào phóng', 'Cho đi', 'Cân bằng'], rev: ['Bất bình đẳng', 'Vay nợ'], img: 'a/a6/Pents06.jpg' },
    { name: 'Seven of Pentacles', desc: 'Kiên nhẫn, chờ đợi kết quả dài hạn.', up: ['Kiên nhẫn', 'Đầu tư', 'Chờ đợi'], rev: ['Nóng vội', 'Thiếu kiên nhẫn'], img: '6/6a/Pents07.jpg' },
    { name: 'Eight of Pentacles', desc: 'Siêng năng, rèn luyện kỹ năng và cống hiến.', up: ['Siêng năng', 'Rèn luyện', 'Cống hiến'], rev: ['Làm đại', 'Thiếu tập trung'], img: '4/49/Pents08.jpg' },
    { name: 'Nine of Pentacles', desc: 'Độc lập tài chính, thành công và thưởng thức.', up: ['Độc lập', 'Thành công', 'Xa xỉ'], rev: ['Sống vượt mức', 'Thiếu an toàn'], img: 'f/f0/Pents09.jpg' },
    { name: 'Ten of Pentacles', desc: 'Di sản, gia đình thịnh vượng và ổn định.', up: ['Di sản', 'Thịnh vượng', 'Gia đình'], rev: ['Xung đột tài sản', 'Mất ổn định'], img: '4/42/Pents10.jpg' },
    { name: 'Page of Pentacles', desc: 'Học hỏi, tham vọng và cơ hội mới.', up: ['Học hỏi', 'Tham vọng', 'Cơ hội'], rev: ['Lười biếng', 'Thiếu tập trung'], img: 'e/ec/Pents11.jpg' },
    { name: 'Knight of Pentacles', desc: 'Kiên trì, chăm chỉ và đáng tin cậy.', up: ['Kiên trì', 'Chăm chỉ', 'Đáng tin'], rev: ['Cứng nhắc', 'Quá thận trọng'], img: 'd/d5/Pents12.jpg' },
    { name: 'Queen of Pentacles', desc: 'Nuôi dưỡng, thực tế và dồi dào.', up: ['Nuôi dưỡng', 'Thực tế', 'Dồi dào'], rev: ['Bỏ bê bản thân', 'Lo lắng tài chính'], img: '8/88/Pents13.jpg' },
    { name: 'King of Pentacles', desc: 'Thịnh vượng, lãnh đạo và thành công vật chất.', up: ['Thịnh vượng', 'Lãnh đạo', 'Thành công'], rev: ['Tham lam', 'Kiểm soát'], img: '1/1c/Pents14.jpg' },
  ]),
];

interface MinorDef {
  name: string; desc: string; up: string[]; rev: string[]; img: string;
}

function generateMinorArcana(
  suit: 'wands' | 'cups' | 'swords' | 'pentacles',
  element: string,
  cards: MinorDef[]
): TarotCard[] {
  return cards.map((c, i) => ({
    id: `${suit}-${i + 1}`,
    name: c.name,
    number: i + 1,
    arcana: 'minor' as const,
    suit,
    image: cardImg(c.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')),
    description: c.desc,
    upright: c.up,
    reversed: c.rev,
    keywords: c.up.map(u => u.toLowerCase()),
    element,
    yesNo: (i % 3 === 0 ? 'yes' : i % 3 === 1 ? 'maybe' : 'no') as 'yes' | 'no' | 'maybe',
    slug: c.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    detailedMeaning: c.desc,
  }));
}

// Helper functions
export function getCardBySlug(slug: string): TarotCard | undefined {
  return tarotCards.find(c => c.slug === slug);
}

export function getMajorArcana(): TarotCard[] {
  return tarotCards.filter(c => c.arcana === 'major');
}

export function getMinorBySuit(suit: string): TarotCard[] {
  return tarotCards.filter(c => c.suit === suit);
}

export function getRandomCards(count: number): { card: TarotCard; isReversed: boolean }[] {
  // Crypto-secure Fisher-Yates shuffle
  const shuffled = [...tarotCards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    const j = arr[0] % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count).map(card => {
    const rev = new Uint8Array(1);
    crypto.getRandomValues(rev);
    return { card, isReversed: rev[0] % 2 === 1 }; // 50/50
  });
}

// Combination interpretations for 3-card spreads
export function getCombinationMeaning(cards: TarotCard[], topic: string): string {
  const majorCount = cards.filter(c => c.arcana === 'major').length;
  const reversedInfo = '';

  const topicIntros: Record<string, string> = {
    love: 'Về tình yêu, sự kết hợp 3 lá bài này cho thấy',
    career: 'Về sự nghiệp, thông điệp tổng hợp từ 3 lá bài là',
    finance: 'Về tài chính, 3 lá bài cùng nhau truyền tải rằng',
    health: 'Về sức khỏe, thông điệp tổng thể cho thấy',
    general: 'Nhìn tổng thể, 3 lá bài này kết hợp để truyền tải rằng',
  };

  const intro = topicIntros[topic] || topicIntros.general;

  if (majorCount >= 2) {
    return `${intro} bạn đang trải qua giai đoạn chuyển biến lớn trong cuộc sống. Sự xuất hiện của ${majorCount} lá Ẩn Chính (${cards.filter(c => c.arcana === 'major').map(c => c.name).join(', ')}) cho thấy đây không phải chuyện nhỏ — vũ trụ đang gửi đến bạn những bài học quan trọng. Hãy chú ý đến thông điệp từ ${cards[1].name} ở vị trí hiện tại, vì nó là chìa khóa kết nối quá khứ (${cards[0].name}) với tương lai (${cards[2].name}).`;
  }

  return `${intro} bạn đang ở giai đoạn cần sự cân bằng giữa hành động và suy ngẫm. ${cards[0].name} cho thấy nền tảng từ quá khứ, ${cards[1].name} phản ánh năng lượng hiện tại, và ${cards[2].name} hé lộ xu hướng sắp đến. Sự kết hợp này gợi ý bạn nên ${cards[2].upright[0].toLowerCase()} dựa trên bài học từ ${cards[0].name.toLowerCase()}.`;
}
