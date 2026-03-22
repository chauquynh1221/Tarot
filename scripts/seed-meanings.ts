import 'dotenv/config';
import { Client } from 'pg';

const client = new Client({ connectionString: process.env.DATABASE_URL });

const meanings = [
{"card_id":0,"category":"GENERAL","content":"The Fool báo hiệu một ngày mới đầy sự bất ngờ và những cơ hội chưa từng có. Hãy mở lòng đón nhận mọi thứ với tâm thế của một đứa trẻ, không định kiến và đầy tò mò."},
{"card_id":0,"category":"LOVE","content":"Một khởi đầu mới đầy thú vị. Nếu đang độc thân, bạn sắp gặp một người khiến bạn thấy tự do. Nếu đã có đôi, hãy cùng nhau làm điều gì đó 'điên rồ' một chút để hâm nóng tình cảm."},
{"card_id":0,"category":"CAREER","content":"Đừng sợ nhảy vào một lĩnh vực mới. The Fool ủng hộ những dự án khởi nghiệp hoặc sự thay đổi công việc đột ngột. Hãy tin vào bản năng của mình."},
{"card_id":0,"category":"FINANCE","content":"Cẩn thận với những quyết định chi tiêu bốc đồng. Đây là lúc để đầu tư vào những ý tưởng mới, nhưng đừng dồn hết vốn liếng vào một chỗ mà không suy nghĩ."},
{"card_id":0,"category":"HEALTH","content":"Năng lượng dồi dào nhưng dễ gặp các tai nạn nhỏ do bất cẩn. Hãy chú ý khi tham gia các hoạt động ngoài trời hoặc du lịch."},
{"card_id":0,"category":"GROWTH","content":"Học cách tin tưởng vào vũ trụ. Bài học lớn nhất lúc này là sự buông bỏ nỗi sợ hãi và dám bước ra khỏi vùng an toàn."},
{"card_id":0,"category":"CREATIVE","content":"Ý tưởng bùng nổ! Đừng để các quy tắc gò bó bạn. Hãy vẽ, viết hoặc sáng tạo bất cứ thứ gì nảy ra trong đầu, dù nó có vẻ kỳ quặc đến đâu."},
{"card_id":1,"category":"GENERAL","content":"Bạn đang nắm giữ quyền năng để thay đổi thực tại. Mọi thứ bạn cần đều đã có sẵn trong tay, chỉ chờ hành động quyết liệt từ bạn."},
{"card_id":1,"category":"LOVE","content":"Sự kết nối dựa trên sự giao tiếp thông minh. Bạn có sức hút rất lớn lúc này, hãy dùng ngôn từ và sự tinh tế để chinh phục đối phương."},
{"card_id":1,"category":"CAREER","content":"Thời điểm vàng để thuyết trình, ký kết hợp đồng hoặc ra mắt sản phẩm. Kỹ năng chuyên môn của bạn đang ở đỉnh cao."},
{"card_id":1,"category":"FINANCE","content":"Tiền bạc đến từ trí tuệ và sự đa năng. Bạn có thể kiếm tiền từ nhiều nguồn khác nhau nếu biết tận dụng các công cụ công nghệ."},
{"card_id":1,"category":"HEALTH","content":"Sức khỏe tinh thần tốt, khả năng tập trung cao. Tuy nhiên, tránh làm việc quá sức dẫn đến căng thẳng thần kinh."},
{"card_id":1,"category":"GROWTH","content":"Hãy học cách làm chủ các kỹ năng mới. Đây là lúc để biến tiềm năng thành hiện thực thông qua sự rèn luyện có mục đích."},
{"card_id":1,"category":"CREATIVE","content":"Khả năng hiện thực hóa ý tưởng cực mạnh. Nếu bạn có một dự án đang dang dở, đây là lúc để hoàn thành nó với chất lượng cao nhất."},
{"card_id":2,"category":"GENERAL","content":"Một ngày để quay vào bên trong. Sự thật không nằm ở những gì hiển hiện, mà nằm ở cảm nhận sâu thẳm của trực giác."},
{"card_id":2,"category":"LOVE","content":"Sự tĩnh lặng và bí ẩn. Đừng vội vàng phơi bày mọi cảm xúc. Hãy lắng nghe nhịp đập trái tim để hiểu đối phương thực sự muốn gì."},
{"card_id":2,"category":"CAREER","content":"Hãy tin vào 'linh tính' khi đưa ra quyết định kinh doanh. Đôi khi những thông tin không chính thống lại là chìa khóa quan trọng."},
{"card_id":2,"category":"FINANCE","content":"Giữ kín các kế hoạch tài chính. Đừng đầu tư theo đám đông, hãy chờ đợi thời điểm mà bạn cảm thấy thực sự an tâm."},
{"card_id":2,"category":"HEALTH","content":"Cần chú trọng đến giấc ngủ và giấc mơ. Cơ thể bạn đang giao tiếp với bạn thông qua những dấu hiệu tâm linh."},
{"card_id":2,"category":"GROWTH","content":"Phát triển khả năng tâm linh và sự thấu cảm. Hãy dành thời gian thiền định hoặc viết nhật ký để kết nối với bản ngã."},
{"card_id":2,"category":"CREATIVE","content":"Cảm hứng đến từ tiềm thức. Những giấc mơ hoặc trạng thái thả lỏng sẽ mang lại cho bạn những ý tưởng nghệ thuật sâu sắc."},
{"card_id":3,"category":"GENERAL","content":"Sự trù phú và nuôi dưỡng đang bao quanh bạn. Một ngày tuyệt vời để tận hưởng vẻ đẹp của thiên nhiên và sự tiện nghi."},
{"card_id":3,"category":"LOVE","content":"Tình yêu nồng cháy và sự chăm sóc tận tụy. Mối quan hệ của bạn đang ở giai đoạn ngọt ngào nhất, có thể có tin vui về thành viên mới."},
{"card_id":3,"category":"CAREER","content":"Các dự án đang phát triển rất tốt. Môi trường làm việc hài hòa giúp bạn phát huy tối đa khả năng nuôi dưỡng các ý tưởng."},
{"card_id":3,"category":"FINANCE","content":"Tài chính vượng. Bạn đang gặt hái được thành quả từ những gì đã gieo trồng. Hãy tận hưởng nhưng đừng quên tái đầu tư vào đất đai hoặc tài sản bền vững."},
{"card_id":3,"category":"HEALTH","content":"Sức khỏe thể chất tốt, khả năng hồi phục nhanh. Hãy chú ý đến chế độ dinh dưỡng và sự cân bằng nội tiết tố."},
{"card_id":3,"category":"GROWTH","content":"Học cách đón nhận tình yêu và sự giúp đỡ. Hãy cho phép bản thân được tận hưởng những thành quả mà mình đã vất vả tạo ra."},
{"card_id":3,"category":"CREATIVE","content":"Sự sáng tạo mang tính bản năng và sinh sôi. Những công việc liên quan đến nghệ thuật, trang trí hoặc làm vườn sẽ rất thăng hoa."},
{"card_id":4,"category":"GENERAL","content":"Sự ổn định và cấu trúc là từ khóa của hôm nay. Hãy thiết lập trật tự trong cuộc sống và làm chủ mọi tình huống."},
{"card_id":4,"category":"LOVE","content":"Một mối quan hệ nghiêm túc, có tính cam kết cao. Tuy nhiên, hãy bớt khắt khe và kiểm soát để đối phương thấy thoải mái hơn."},
{"card_id":4,"category":"CAREER","content":"Khẳng định vị thế lãnh đạo. Kỷ luật và sự kiên định sẽ giúp bạn nhận được sự nể trọng từ đồng nghiệp và cấp dưới."},
{"card_id":4,"category":"FINANCE","content":"Quản lý tài chính chặt chẽ. Đây là lúc để xây dựng ngân sách dài hạn và bảo vệ tài sản của mình một cách kiên cố."},
{"card_id":4,"category":"HEALTH","content":"Cơ thể cần một chế độ tập luyện kỷ luật. Hãy chú ý đến xương khớp và duy trì lối sống lành mạnh, điều độ."},
{"card_id":4,"category":"GROWTH","content":"Xây dựng sự tự tin và bản lĩnh cá nhân. Hãy học cách bảo vệ quan điểm và tạo ra ranh giới lành mạnh cho bản thân."},
{"card_id":4,"category":"CREATIVE","content":"Sáng tạo trong khuôn khổ. Những dự án đòi hỏi sự logic, kiến trúc hoặc lập trình sẽ gặt hái được thành công lớn."},
{"card_id":5,"category":"GENERAL","content":"Một ngày của sự học hỏi và tuân thủ. Những giá trị truyền thống và lời khuyên từ người đi trước sẽ là kim chỉ nam cho bạn hôm nay."},
{"card_id":5,"category":"LOVE","content":"Hướng tới sự cam kết lâu dài. Nếu đang trong một mối quan hệ, đây là lúc bàn tính chuyện trăm năm hoặc ra mắt gia đình."},
{"card_id":5,"category":"CAREER","content":"Hãy tìm kiếm một người thầy hoặc tham gia các khóa đào tạo bài bản. Làm việc trong môi trường có tổ chức và quy trình rõ ràng sẽ giúp bạn thăng tiến bền vững."},
{"card_id":5,"category":"FINANCE","content":"Ưu tiên các hình thức tiết kiệm và đầu tư an toàn, chính thống. Tránh xa các kế hoạch làm giàu nhanh chóng hoặc thiếu minh bạch."},
{"card_id":5,"category":"HEALTH","content":"Hãy lắng nghe chỉ dẫn của chuyên gia y tế. Duy trì những thói quen tốt đã được kiểm chứng thay vì thử các phương pháp chữa trị lạ lẫm."},
{"card_id":5,"category":"GROWTH","content":"Tìm hiểu về nguồn cội và niềm tin của bản thân. Đây là giai đoạn để củng cố hệ giá trị đạo đức và triết lý sống cá nhân."},
{"card_id":5,"category":"CREATIVE","content":"Sáng tạo dựa trên những nền tảng kinh điển. Bạn có thể làm mới những chất liệu cũ hoặc áp dụng những kỹ thuật truyền thống vào tác phẩm hiện đại."},
{"card_id":6,"category":"GENERAL","content":"Ngày của những sự lựa chọn quan trọng và sự hòa hợp. Hãy lắng nghe trái tim mình trước khi đưa ra bất kỳ quyết định nào."},
{"card_id":6,"category":"LOVE","content":"Một sự kết nối sâu sắc về tâm hồn. Sự quyến rũ và đam mê đang ở mức cao nhất. Đây là lúc để hâm nóng tình cảm hoặc tìm thấy 'nửa kia' đích thực."},
{"card_id":6,"category":"CAREER","content":"Sự hợp tác sẽ mang lại thành công lớn. Hãy tìm kiếm những cộng sự có cùng chí hướng và giá trị để cùng nhau phát triển dự án."},
{"card_id":6,"category":"FINANCE","content":"Đứng trước ngã rẽ về tiền bạc. Hãy cân nhắc giữa lợi ích vật chất và sự thoải mái về tinh thần khi đầu tư hoặc chi tiêu."},
{"card_id":6,"category":"HEALTH","content":"Sức khỏe phụ thuộc nhiều vào trạng thái tinh thần. Hãy tìm kiếm sự cân bằng và giải tỏa những áp lực trong các mối quan hệ."},
{"card_id":6,"category":"GROWTH","content":"Học cách yêu thương bản thân và chấp nhận những mặt đối lập bên trong mình. Sự hòa hợp nội tâm sẽ giúp bạn tự tin hơn."},
{"card_id":6,"category":"CREATIVE","content":"Cảm hứng bùng nổ từ những xúc cảm mãnh liệt. Những tác phẩm về chủ đề tình yêu, con người và sự kết nối sẽ có sức lan tỏa mạnh mẽ."},
{"card_id":7,"category":"GENERAL","content":"Sẵn sàng cho một cuộc bứt phá! Ý chí và sự quyết tâm sẽ giúp bạn vượt qua mọi chướng ngại vật để giành lấy chiến thắng."},
{"card_id":7,"category":"LOVE","content":"Hãy làm chủ cảm xúc và bản năng. Một tình yêu đầy nhiệt huyết nhưng cần sự thấu hiểu để không biến thành sự kiểm soát lẫn nhau."},
{"card_id":7,"category":"CAREER","content":"Tốc độ và sự thăng tiến. Bạn đang nắm thế chủ động, hãy tập trung vào mục tiêu và không để những tác động bên ngoài làm xao nhãng."},
{"card_id":7,"category":"FINANCE","content":"Thời điểm để giải quyết dứt điểm các vấn đề tài chính tồn đọng. Một khoản chi lớn cho phương tiện đi lại hoặc du lịch có thể xuất hiện."},
{"card_id":7,"category":"HEALTH","content":"Sức bền và năng lượng thể chất tuyệt vời. Hãy duy trì tập luyện để giải phóng năng lượng dư thừa và giữ tinh thần minh mẫn."},
{"card_id":7,"category":"GROWTH","content":"Rèn luyện kỷ luật thép và sự tự tin. Bài học lớn nhất lúc này là khả năng kiểm soát số phận của chính mình thông qua hành động."},
{"card_id":7,"category":"CREATIVE","content":"Nỗ lực đưa ý tưởng vào thực tế. Đừng chỉ mơ mộng, hãy dùng sức mạnh ý chí để hoàn thiện tác phẩm của bạn đúng thời hạn."},
{"card_id":8,"category":"GENERAL","content":"Sức mạnh thực sự nằm ở sự nhẫn nại và lòng trắc ẩn. Hãy dùng 'nhu' để thắng 'cương' trong mọi tình huống của hôm nay."},
{"card_id":8,"category":"LOVE","content":"Sự dịu dàng có thể chinh phục được cả những trái tim gai góc nhất. Hãy kiên nhẫn với đối phương và học cách chấp nhận những khiếm khuyết của nhau."},
{"card_id":8,"category":"CAREER","content":"Lãnh đạo bằng sự thấu hiểu. Bạn sẽ nhận được sự nể trọng khi biết lắng nghe và điều phối các xung đột trong đội ngũ một cách khéo léo."},
{"card_id":8,"category":"FINANCE","content":"Kiểm soát ham muốn chi tiêu bốc đồng. Sự kiên trì tích lũy sẽ giúp bạn có một nền tảng tài chính vững chắc hơn là những khoản đầu tư mạo hiểm."},
{"card_id":8,"category":"HEALTH","content":"Khả năng hồi phục rất tốt. Hãy chú trọng vào các hoạt động giúp cân bằng tâm trí như Yoga hoặc thiền để tăng cường sức sống nội tại."},
{"card_id":8,"category":"GROWTH","content":"Đối diện và thuần hóa 'con thú' bên trong mình. Hãy học cách chuyển hóa những cảm xúc tiêu cực thành sức mạnh sáng tạo và lòng tốt."},
{"card_id":8,"category":"CREATIVE","content":"Sức mạnh nội tâm được chuyển hóa thành nghệ thuật. Những tác phẩm mang tính chữa lành và sâu sắc sẽ được ra đời trong giai đoạn này."},
{"card_id":9,"category":"GENERAL","content":"Một ngày để chiêm nghiệm và tĩnh lặng. Hãy tách mình ra khỏi đám đông để tìm kiếm câu trả lời thực sự nằm sâu trong lòng mình."},
{"card_id":9,"category":"LOVE","content":"Cần khoảng không gian riêng tư. Đừng lo lắng nếu bạn cảm thấy muốn ở một mình, đây là lúc để bạn hiểu rõ mình thực sự cần gì trong một mối quan hệ."},
{"card_id":9,"category":"CAREER","content":"Làm việc độc lập hoặc nghiên cứu chuyên sâu sẽ mang lại hiệu quả cao. Hãy dành thời gian để lập kế hoạch dài hạn thay vì chạy theo các mục tiêu ngắn hạn."},
{"card_id":9,"category":"FINANCE","content":"Xem xét kỹ lưỡng các khoản đầu tư. Đây không phải lúc để vung tay quá trán. Hãy học cách chi tiêu tối giản và thực tế hơn."},
{"card_id":9,"category":"HEALTH","content":"Cơ thể cần được nghỉ ngơi và thải độc tinh thần. Hãy dành thời gian cho thiên nhiên hoặc thiền định để tái tạo năng lượng."},
{"card_id":9,"category":"GROWTH","content":"Hành trình khám phá nội tâm. Bài học về sự cô độc lành mạnh sẽ giúp bạn trưởng thành và tìm thấy ánh sáng chân lý của riêng mình."},
{"card_id":9,"category":"CREATIVE","content":"Cảm hứng đến từ sự tĩnh lặng. Những ý tưởng độc đáo sẽ nảy mầm khi bạn không còn bị xao nhãng bởi những ồn ào bên ngoài."},
];

async function seed() {
  await client.connect();
  console.log('🌱 Inserting ' + meanings.length + ' meanings...\n');

  let ok = 0;
  for (const m of meanings) {
    await client.query(
      'INSERT INTO "CardMeaning" (card_id, category, content) VALUES ($1, $2, $3)',
      [m.card_id + 1, m.category, m.content]
    );
    ok++;
  }
  console.log('  ✅ Inserted ' + ok + '/' + meanings.length);

  const res = await client.query('SELECT COUNT(*) FROM "CardMeaning"');
  console.log('\n📖 Done! Total meanings in DB: ' + res.rows[0].count);

  await client.end();
}

seed().catch(e => { console.error(e); process.exit(1); });
