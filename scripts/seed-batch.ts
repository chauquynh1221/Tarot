import 'dotenv/config';
import { Client } from 'pg';

const client = new Client({ connectionString: process.env.DATABASE_URL });

const cardMeanings: Record<number, Record<string, string>> = {
  // 11. Justice
  11: {
    GENERAL: 'Mọi chuyện trong ngày sẽ được giải quyết dựa trên lý lẽ, bằng chứng và sự thật khách quan; đây không phải lúc để dùng cảm xúc hay sự thiên vị để xử lý vấn đề.',
    LOVE: 'Sự trung thực tuyệt đối là yêu cầu bắt buộc; nếu có mâu thuẫn, cả hai cần ngồi lại nói chuyện thẳng thắn để tìm ra giải pháp công bằng nhất, không ai được lấn lướt hay chịu thiệt thòi.',
    CAREER: 'Các vấn đề về hợp đồng, ký kết hoặc phân chia quyền lợi sẽ diễn ra minh bạch; bạn sẽ nhận được đúng những gì mình đã nỗ lực đóng góp, mọi sự gian lận hoặc thiếu chuyên nghiệp đều sẽ bị lộ tẩy.',
    FINANCE: 'Hãy thanh toán dứt điểm các khoản nợ và minh bạch hóa các nguồn thu chi; đây là thời điểm lý tưởng để xử lý các thủ tục giấy tờ, hóa đơn hoặc các vấn đề pháp lý liên quan đến tài sản.',
    HEALTH: 'Cơ thể bạn đang phản hồi chính xác lối sống gần đây; hãy thiết lập lại sự cân bằng bằng cách ăn uống và tập luyện điều độ, đồng thời nên tin tưởng vào các phương pháp điều trị có cơ sở khoa học.',
    GROWTH: 'Bài học lớn nhất là tự chịu trách nhiệm cho mọi lựa chọn của mình; hãy nhìn nhận những sai lầm trong quá khứ một cách công tâm để sửa đổi thay vì tìm cách đổ lỗi cho hoàn cảnh.',
    CREATIVE: 'Sáng tạo cần đi đôi với tính logic và cấu trúc rõ ràng; những tác phẩm có bố cục cân đối, mang thông điệp về công lý, xã hội hoặc sự thật sẽ có sức nặng và được đánh giá cao.',
  },
  // 12. The Hanged Man
  12: {
    GENERAL: 'Mọi thứ trong cuộc sống của bạn đang rơi vào trạng thái đình trệ hoặc tạm dừng; thay vì cố gắng vùng vẫy để thoát ra, bạn nên chấp nhận sự chờ đợi này như một cơ hội để quan sát mọi thứ từ một góc nhìn mới.',
    LOVE: 'Mối quan hệ đang ở giai đoạn "lấp lửng" và không có tiến triển mới; bạn hoặc đối phương cần học cách hy sinh cái tôi cá nhân hoặc những kỳ vọng cũ kỹ để thấu hiểu nhau sâu sắc hơn thay vì cứ ép buộc mọi thứ theo ý mình.',
    CAREER: 'Công việc không có sự thăng tiến hay thay đổi rõ rệt trong lúc này, thậm chí dự án có thể bị hoãn lại; đây là thời điểm để bạn rà soát, đánh giá lại năng lực bản thân và tìm kiếm những phương pháp tiếp cận công việc hoàn toàn khác biệt.',
    FINANCE: 'Dòng tiền đang bị "đóng băng" hoặc các kế hoạch đầu tư không mang lại kết quả như mong đợi; lời khuyên tốt nhất lúc này là giữ chặt túi tiền, không nên mạo hiểm và hãy học cách hài lòng với những gì đang có thay vì cố chấp làm giàu nhanh.',
    HEALTH: 'Cơ thể đang phát ra tín hiệu cần được nghỉ ngơi và hồi phục sau một thời gian dài căng thẳng; bạn nên ưu tiên các hoạt động tĩnh như thiền, Yoga hoặc ngủ đủ giấc để tái tạo năng lượng thay vì ép bản thân vận động quá sức.',
    GROWTH: 'Bài học lớn nhất là sự buông bỏ quyền kiểm soát; bạn cần hiểu rằng đôi khi việc không làm gì cả và để mọi thứ diễn ra tự nhiên lại chính là cách tốt nhất để bạn trưởng thành và tìm thấy sự bình an trong tâm hồn.',
    CREATIVE: 'Ý tưởng của bạn đang bị tắc nghẽn nếu cứ đi theo lối mòn cũ; hãy thử đảo ngược quy trình, thay đổi không gian làm việc hoặc nhìn nhận vấn đề theo một hướng "ngược đời" nhất, bạn sẽ tìm thấy những đột phá không ngờ.',
  },
  // 13. Death
  13: {
    GENERAL: 'Một giai đoạn, một thói quen hoặc một tình huống cũ đang đi đến hồi kết thúc tất yếu; đừng cố níu kéo vì sự chấm dứt này là điều kiện bắt buộc để những cơ hội mới có chỗ xuất hiện.',
    LOVE: 'Mối quan hệ hiện tại đang đứng trước sự biến đổi sâu sắc, có thể là sự kết thúc của một cuộc tình đã cạn kiệt năng lượng hoặc sự chấm dứt hoàn toàn cách hành xử cũ để cả hai cùng bước sang một chương mới khác hẳn.',
    CAREER: 'Một dự án, một công việc hoặc một vị trí bạn đang nắm giữ sắp kết thúc; đây là lúc bạn cần dứt khoát rời bỏ những gì không còn giá trị phát triển và sẵn sàng chuyển hướng sang một lĩnh vực hoàn toàn mới.',
    FINANCE: 'Bạn phải cắt bỏ ngay những nguồn chi tiêu lãng phí hoặc những khoản đầu tư không hiệu quả; một sự thay đổi triệt để và quyết liệt trong cách quản lý tiền bạc lúc này sẽ giúp bạn tránh được những rủi ro lớn hơn.',
    HEALTH: 'Cơ thể bạn cần một cuộc "thanh lọc" mạnh mẽ, hãy từ bỏ dứt điểm các thói quen xấu ảnh hưởng đến sức khỏe; đây là thời điểm lý tưởng để bắt đầu một chế độ sinh hoạt mới hoàn toàn từ con số không.',
    GROWTH: 'Bài học lớn nhất là sự tái sinh sau khi buông bỏ; bạn cần chấp nhận rằng một phần con người cũ của mình phải "chết đi" thì bạn mới có đủ không gian để trưởng thành và đón nhận những tư duy tiến bộ hơn.',
    CREATIVE: 'Đừng ngại đập đi xây lại toàn bộ ý tưởng nếu nó đã đi vào ngõ cụt; việc xóa bỏ những bản thảo cũ và bắt đầu lại từ một tờ giấy trắng sẽ giúp bạn tạo ra những đột phá nghệ thuật thực sự mạnh mẽ.',
  },
  // 14. Temperance
  14: {
    GENERAL: 'Mọi việc trong ngày cần được thực hiện với sự chừng mực và kiềm chế; đây không phải lúc cho những hành động cực đoan hay vội vã mà là lúc để bạn tìm điểm giao thoa hợp lý giữa các luồng ý kiến trái chiều.',
    LOVE: 'Mối quan hệ đang đòi hỏi sự nhẫn nại và khả năng thỏa hiệp cao; hãy học cách lắng nghe để dung hòa sự khác biệt giữa hai người thay vì cố gắng phân định ai đúng ai sai hay phản ứng gay gắt trong lúc nóng nảy.',
    CAREER: 'Bạn cần phối hợp nhịp nhàng giữa các mục tiêu ngắn hạn và dài hạn; thành công sẽ đến từ việc bạn biết kết hợp khéo léo các nguồn lực sẵn có và duy trì một nhịp độ làm việc ổn định, không để bản thân rơi vào tình trạng quá tải.',
    FINANCE: 'Hãy duy trì kế hoạch chi tiêu trung dung, tuyệt đối tránh xa các quyết định tài chính mang tính chất may rủi hoặc mua sắm theo cảm hứng; sự thịnh vượng bền vững lúc này đến từ việc tích lũy và quản lý dòng tiền một cách hợp lý.',
    HEALTH: 'Cơ thể bạn cần sự điều độ trong mọi thói quen từ ăn uống đến vận động; hãy chú trọng vào việc giữ cho tâm trí và thể chất luôn ở trạng thái hài hòa, tránh làm việc hay luyện tập quá sức dẫn đến kiệt quệ năng lượng.',
    GROWTH: 'Bài học lớn nhất là khả năng giữ sự điềm tĩnh và tự chủ trong mọi hoàn cảnh; bạn đang học cách làm chủ cảm xúc của mình, không để những biến cố bên ngoài làm xáo trộn sự bình an và sáng suốt nội tại.',
    CREATIVE: 'Hãy thử nghiệm việc pha trộn giữa cái cũ và cái mới, giữa kỹ thuật truyền thống và công nghệ hiện đại; sự sáng tạo thành công nhất lúc này chính là kết quả của sự tổng hòa một cách tinh tế và tỉ mỉ từ nhiều nguồn cảm hứng khác nhau.',
  },
  // 15. The Devil
  15: {
    GENERAL: 'Bạn đang cảm thấy bị mắc kẹt trong những thói quen xấu, sự ám ảnh hoặc những ham muốn vật chất quá đà; thực chất xiềng xích này do chính bạn tự tạo ra và bạn hoàn toàn có quyền chọn cách dứt bỏ nó.',
    LOVE: 'Mối quan hệ đang có dấu hiệu độc hại, kiểm soát hoặc quá lệ thuộc vào cảm xúc và thể xác; hãy tỉnh táo để nhận ra liệu bạn đang yêu thật sự hay chỉ đang bị cuốn vào một sự ràng buộc không lành mạnh và thiếu tự do.',
    CAREER: 'Bạn đang cảm thấy bị trói buộc vào một công việc chỉ vì thu nhập hoặc sự thăng tiến mà đánh mất đi sự sáng tạo và tự do cá nhân; cẩn thận với những cám dỗ làm giàu nhanh chóng nhưng thiếu minh bạch hoặc trái với đạo đức nghề nghiệp.',
    FINANCE: 'Tài chính đang bị chi phối bởi những thói quen tiêu xài hoang phí, nợ nần hoặc lòng tham nhất thời; bạn cần rà soát lại các khoản chi và dừng ngay việc vung tiền vào những thứ phù phiếm để không rơi vào tình trạng mất kiểm soát hoàn toàn.',
    HEALTH: 'Cơ thể đang cảnh báo về sự quá đà trong lối sống như thức khuya, ăn uống vô độ hoặc lạm dụng các chất kích thích; bạn cần một đợt thanh lọc cơ thể và thiết lập lại kỷ luật bản thân ngay lập tức để tránh những tổn hại nghiêm trọng về lâu dài.',
    GROWTH: 'Bài học lớn nhất là đối diện với mặt tối của bản thân và những nỗi sợ hãi đang kìm hãm bạn; hãy nhận diện những niềm tin sai lệch đang trói buộc tâm trí để tự giải phóng mình và bước ra khỏi vùng tối của tư duy trì trệ.',
    CREATIVE: 'Sáng tạo dựa trên những chủ đề gai góc, sự nổi loạn hoặc những mảng tối trong tâm lý con người; đây là lúc để bạn bứt phá khỏi các khuôn mẫu cũ, nhưng đừng để sự ám ảnh về cái tôi quá lớn làm mờ nhạt đi thông điệp thực sự của tác phẩm.',
  },
  // 16. The Tower
  16: {
    GENERAL: 'Một sự kiện đột ngột và nằm ngoài dự tính sẽ xảy ra làm đảo lộn hoàn toàn cuộc sống hiện tại của bạn; tuy gây sốc nhưng đây là sự sụp đổ cần thiết để quét sạch những gì giả dối, giúp bạn xây dựng lại trên một nền móng vững chắc hơn.',
    LOVE: 'Một bí mật bị phơi bày hoặc một trận cãi vã chấn động dẫn đến sự rạn nứt hoặc đổ vỡ của mối quan hệ; đừng cố níu kéo đống đổ nát này vì thực tế nó đã mục nát từ bên trong và đây là lúc để bạn đối diện với sự thật phũ phàng.',
    CAREER: 'Cảnh báo về việc mất việc, dự án bị hủy bỏ hoặc thay đổi nhân sự đột ngột khiến vị trí của bạn bị lung lay dữ dội; hãy coi đây là đợt "thanh lọc" bắt buộc để bạn thoát khỏi một môi trường không còn phù hợp và tìm kiếm một hướng đi mới đúng đắn hơn.',
    FINANCE: 'Khủng hoảng tài chính bất ngờ hoặc một khoản thua lỗ lớn nằm ngoài dự tính; bạn cần đối diện trực tiếp với sự thật về con số để cắt lỗ ngay lập tức thay vì tiếp tục mơ mộng hoặc duy trì những khoản đầu tư đang trên đà sụp đổ.',
    HEALTH: 'Cần đặc biệt cẩn thận với các tai nạn bất ngờ hoặc những cơn đau cấp tính buộc bạn phải dừng mọi công việc để điều trị ngay; tinh thần có thể bị sốc nặng, hãy ưu tiên việc nghỉ ngơi và đừng chủ quan với bất kỳ dấu hiệu bất thường nào của cơ thể.',
    GROWTH: 'Bài học về sự tỉnh thức sau một biến cố lớn; bạn sẽ nhận ra những niềm tin cũ kỹ bấy lâu nay chỉ là ảo tưởng, từ đó giúp bạn phá bỏ cái tôi quá lớn để bắt đầu một hành trình mới với tư duy khiêm nhường và thực tế hơn.',
    CREATIVE: 'Đừng ngại xóa bỏ hoàn toàn một tác phẩm hay ý tưởng đã đi vào ngõ cụt để bắt đầu lại từ một tờ giấy trắng; chính sự sụp đổ của những khuôn mẫu cũ sẽ khơi nguồn cho những đột phá nghệ thuật mạnh mẽ và táo bạo nhất mà bạn từng có.',
  },
  // 17. The Star
  17: {
    GENERAL: 'Mọi giông bão đã đi qua, đây là thời điểm bạn tìm thấy sự bình yên và niềm tin trở lại vào cuộc sống; những hy vọng mới bắt đầu nhen nhóm và mọi việc sẽ dần chuyển biến theo hướng tích cực một cách tự nhiên.',
    LOVE: 'Những tổn thương trong quá khứ đang được chữa lành, giúp bạn mở lòng hơn để đón nhận một tình yêu chân thành và nhẹ nhàng; nếu đã có đôi, hai bạn sẽ tìm thấy tiếng nói chung và sự gắn kết sâu sắc về mặt tâm hồn.',
    CAREER: 'Bạn đang đi đúng hướng và bắt đầu nhận được những tín hiệu lạc quan cho tương lai dài hạn; đây là lúc để bạn tự tin phát huy năng lực sáng tạo và tin tưởng vào những mục tiêu lớn mà mình đang theo đuổi.',
    FINANCE: 'Tình hình tài chính đang dần ổn định trở lại sau giai đoạn khó khăn hoặc thất thoát; tuy tiền bạc không đến ngay lập tức một cách dồn dập, nhưng những kế hoạch tài chính đúng đắn sẽ bắt đầu mang lại kết quả bền vững.',
    HEALTH: 'Sức khỏe cả về thể chất lẫn tinh thần đang trong giai đoạn hồi phục rất tốt; hãy tiếp tục duy trì các thói quen lành mạnh và dành thời gian thư giãn để cơ thể được tái tạo năng lượng một cách trọn vẹn nhất.',
    GROWTH: 'Bài học lớn nhất là học cách tin tưởng vào bản thân và vũ trụ sau những vấp ngã; bạn đang tìm lại được mục đích sống thực sự và cảm thấy bình an hơn khi biết rằng mọi thứ rồi sẽ ổn thỏa theo cách của nó.',
    CREATIVE: 'Luồng cảm hứng tươi mới đang tràn về giúp bạn nảy ra những ý tưởng mang tính thẩm mỹ cao và giàu cảm xúc; hãy tận dụng giai đoạn này để sáng tạo nên những tác phẩm có khả năng truyền cảm hứng và chữa lành cho người khác.',
  },
  // 18. The Moon
  18: {
    GENERAL: 'Mọi thứ xung quanh bạn hiện đang rất nhập nhằng và thiếu minh bạch; đây là lúc bạn dễ bị nhầm lẫn bởi những thông tin sai lệch hoặc ảo tưởng cá nhân, vì vậy tuyệt đối không nên đưa ra các quyết định quan trọng.',
    LOVE: 'Mối quan hệ đang bao trùm bởi sự hoài nghi, hiểu lầm hoặc có những bí mật chưa được tiết lộ; bạn cần tỉnh táo để phân biệt giữa nỗi sợ hãi do mình tự tưởng tượng ra và thực tế đang diễn ra để tránh ghen tuông vô cớ.',
    CAREER: 'Môi trường làm việc đang thiếu sự công khai và có thể xuất hiện những ý đồ ngầm từ đồng nghiệp hoặc đối tác; hãy cẩn trọng với các lời hứa hẹn chưa có căn cứ và tin vào trực giác của mình để nhận diện các rủi ro tiềm ẩn.',
    FINANCE: 'Cảnh báo về các rủi ro tài chính bị che giấu hoặc những cái bẫy đầu tư nhìn có vẻ hấp dẫn nhưng thiếu thực tế; hãy kiểm tra kỹ mọi điều khoản giấy tờ và không xuống tiền khi cảm thấy thông tin còn mù mờ.',
    HEALTH: 'Chú ý đến các vấn đề về tâm lý như lo âu kéo dài, mất ngủ hoặc những thay đổi nội tiết tố khó nhận biết; đây là lúc bạn cần đi khám chuyên khoa nếu thấy cơ thể có những dấu hiệu bất thường mà không rõ nguyên nhân.',
    GROWTH: 'Bài học lớn nhất là học cách đối diện với những nỗi sợ sâu thẳm và sự bất định của cuộc sống; bạn đang rèn luyện khả năng lắng nghe trực giác để tìm ra lối đi đúng đắn ngay cả khi mọi thứ xung quanh đang tối tăm và xáo trộn.',
    CREATIVE: 'Cảm hứng bùng nổ từ thế giới của những giấc mơ và những hình ảnh siêu thực; đây là thời điểm vàng để bạn khai thác các ý tưởng mang tính huyền bí, tâm lý học hoặc những tác phẩm có chiều sâu cảm xúc mãnh liệt.',
  },
  // 19. The Sun
  19: {
    GENERAL: 'Mọi thứ đều trở nên sáng tỏ, thuận lợi và tràn đầy hy vọng; đây là thời điểm rực rỡ nhất để bạn gặt hái thành quả, nhận được sự công nhận và tận hưởng niềm vui trọn vẹn.',
    LOVE: 'Mối quan hệ tràn đầy sự ấm áp, chân thành và tin tưởng tuyệt đối vào nhau; những hiểu lầm cũ được xóa bỏ hoàn toàn, thay vào đó là sự gắn kết bền vững, hạnh phúc và có thể có những tin vui lớn.',
    CAREER: 'Bạn đạt được thành công vang dội và nhận được sự nể trọng xứng đáng từ đồng nghiệp lẫn cấp trên; mọi kế hoạch hay dự án bạn đang thực hiện đều diễn ra suôn sẻ và mang lại kết quả vượt mong đợi.',
    FINANCE: 'Tình hình tài chính khởi sắc mạnh mẽ, minh bạch và ổn định; bạn có thể nhận được những khoản lợi nhuận lớn, sự tăng lương hoặc những cơ hội tiền bạc rõ ràng giúp bạn hoàn toàn tự tin vào tương lai.',
    HEALTH: 'Sức khỏe đang ở trạng thái sung mãn nhất, tràn đầy năng lượng và sức sống mãnh liệt; tinh thần lạc quan và minh mẫn sẽ giúp bạn hồi phục cực kỳ nhanh chóng nếu có vấn đề thể chất trước đó.',
    GROWTH: 'Bài học lớn nhất là học cách sống trọn vẹn với niềm vui và sự tự tin vào chính mình; bạn đang chạm tới ngưỡng cửa của sự tự nhận thức, tỏa sáng một cách tự nhiên và không còn bị kìm hãm bởi những nỗi sợ cũ.',
    CREATIVE: 'Cảm hứng dồi dào giúp bạn tạo ra những tác phẩm mang năng lượng tích cực và có sức lan tỏa rộng rãi; đây là thời điểm vàng để bạn ra mắt các dự án tâm huyết vì chúng chắc chắn sẽ nhận được sự ủng hộ nhiệt liệt.',
  },
  // 20. Judgement
  20: {
    GENERAL: 'Đã đến lúc bạn phải đưa ra quyết định cuối cùng cho một vấn đề kéo dài; đây là sự thức tỉnh giúp bạn nhìn nhận lại toàn bộ hành trình đã qua để dứt khoát bước sang một chương mới hoàn toàn khác biệt.',
    LOVE: 'Một thời điểm "phán xét" cho mối quan hệ: hoặc là sự tha thứ để cùng nhau tái sinh, hoặc là quyết định dứt khoát chấm dứt dựa trên những gì cả hai đã trải qua; không còn chỗ cho sự trốn tránh hay mập mờ.',
    CAREER: 'Bạn sẽ nhận được kết quả xứng đáng cho những nỗ lực (hoặc sai lầm) trong quá khứ thông qua các đợt đánh giá năng lực; đây cũng là tiếng gọi thôi thúc bạn chuyển sang một công việc đúng với lý tưởng thực sự của mình.',
    FINANCE: 'Các vấn đề tiền bạc tồn đọng hoặc tranh chấp pháp lý sẽ đi đến hồi kết với một phán quyết rõ ràng; hãy kiểm tra kỹ các cam kết tài chính cũ vì chúng sẽ được đem ra xem xét lại trong thời gian này.',
    HEALTH: 'Một giai đoạn hồi phục mạnh mẽ sau thời gian dài điều trị hoặc bạn sẽ nhận được kết quả chẩn đoán chính xác giúp chấm dứt sự lo âu; cơ thể bạn đang có cơ hội để "tái sinh" và nạp lại năng lượng mới.',
    GROWTH: 'Bài học về sự tự đánh giá và tha thứ cho chính mình; bạn đang tìm thấy mục đích sống cao cả hơn và sẵn sàng rũ bỏ lớp vỏ cũ để sống một cuộc đời có ý nghĩa, trung thực với bản chất thật của bản thân.',
    CREATIVE: 'Đây là thời điểm để hoàn thiện và công bố tác phẩm sau thời gian dài ấp ủ; bạn sẽ nhận được những phản hồi công tâm, giúp bạn nhận diện rõ giá trị thực sự và hướng đi tiếp theo trong hành trình sáng tạo của mình.',
  },
  // 21. The World
  21: {
    GENERAL: 'Mọi kế hoạch của bạn đang đi đến hồi kết thúc viên mãn; bạn đã hoàn thành một hành trình dài và đây là lúc để tận hưởng cảm giác tự hào, trọn vẹn khi mọi thứ đều diễn ra đúng như ý nguyện.',
    LOVE: 'Mối quan hệ đạt đến sự thấu hiểu và gắn kết sâu sắc nhất; đây là thời điểm lý tưởng cho một cam kết lâu dài, một đám cưới hoặc đơn giản là sự hòa hợp tuyệt đối sau khi đã cùng nhau vượt qua mọi thử thách.',
    CAREER: 'Bạn đã chinh phục được mục tiêu lớn nhất hoặc hoàn thành xuất sắc một dự án dài hơi; đây là lúc để nhận phần thưởng xứng đáng, thăng tiến lên vị trí cao hơn hoặc có những cơ hội mở rộng sự nghiệp ra quy mô quốc tế.',
    FINANCE: 'Tình hình tài chính đạt đến ngưỡng an toàn và thịnh vượng bền vững; các khoản đầu tư đã sinh lời ổn định và bạn hoàn toàn có đủ nguồn lực để tận hưởng cuộc sống hoặc thực hiện những dự định lớn mà không cần lo lắng.',
    HEALTH: 'Cơ thể và tâm trí của bạn đang ở trạng thái cân bằng và khỏe mạnh nhất; mọi nỗ lực chăm sóc bản thân trước đây đã mang lại kết quả rõ rệt, giúp bạn có một sức sống bền bỉ và tinh thần cực kỳ lạc quan.',
    GROWTH: 'Bài học lớn nhất là sự nhận thức về vị trí của bản thân trong thế giới; bạn không còn cảm thấy lạc lõng mà đã tìm thấy sự bình an trọn vẹn, hiểu rằng mọi trải nghiệm đã qua đều là những mảnh ghép cần thiết để tạo nên phiên bản hoàn hảo của bạn hôm nay.',
    CREATIVE: 'Đây là thời điểm "vàng" để ra mắt tác phẩm tâm huyết ra công chúng; sự sáng tạo của bạn đã đạt đến độ chín muồi, mang lại sự công nhận rộng rãi và giúp bạn hoàn tất một chương lớn đầy tự hào trong hành trình nghệ thuật của mình.',
  },
};

async function run() {
  await client.connect();

  for (const [cardNumber, meanings] of Object.entries(cardMeanings)) {
    const r = await client.query('SELECT card_id FROM "Card" WHERE number = $1', [parseInt(cardNumber)]);
    if (r.rows.length === 0) { console.error('Card not found: number=' + cardNumber); continue; }
    const cardId = r.rows[0].card_id;

    for (const [category, content] of Object.entries(meanings)) {
      await client.query(
        'INSERT INTO "CardMeaning" (card_id, category, content) VALUES ($1, $2, $3)',
        [cardId, category, content]
      );
    }
    console.log('✅ Card #' + cardNumber + ' (card_id=' + cardId + '): 7 meanings inserted');
  }

  const res = await client.query('SELECT COUNT(*) FROM "CardMeaning"');
  console.log('\n📖 Total meanings in DB: ' + res.rows[0].count);
  await client.end();
}

run().catch(e => { console.error(e); process.exit(1); });
