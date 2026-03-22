import 'dotenv/config';
import { Client } from 'pg';

const client = new Client({ connectionString: process.env.DATABASE_URL });

// All cards by name - covers remaining Major Arcana 16-21 + Wands
const cardMeanings: Record<string, Record<string, string>> = {
  'The Tower': {
    GENERAL: 'Một sự kiện đột ngột và nằm ngoài dự tính sẽ xảy ra làm đảo lộn hoàn toàn cuộc sống hiện tại của bạn; tuy gây sốc nhưng đây là sự sụp đổ cần thiết để quét sạch những gì giả dối, giúp bạn xây dựng lại trên một nền móng vững chắc hơn.',
    LOVE: 'Một bí mật bị phơi bày hoặc một trận cãi vã chấn động dẫn đến sự rạn nứt hoặc đổ vỡ của mối quan hệ; đừng cố níu kéo đống đổ nát này vì thực tế nó đã mục nát từ bên trong và đây là lúc để bạn đối diện với sự thật phũ phàng.',
    CAREER: 'Cảnh báo về việc mất việc, dự án bị hủy bỏ hoặc thay đổi nhân sự đột ngột khiến vị trí của bạn bị lung lay dữ dội; hãy coi đây là đợt "thanh lọc" bắt buộc để bạn thoát khỏi một môi trường không còn phù hợp và tìm kiếm một hướng đi mới đúng đắn hơn.',
    FINANCE: 'Khủng hoảng tài chính bất ngờ hoặc một khoản thua lỗ lớn nằm ngoài dự tính; bạn cần đối diện trực tiếp với sự thật về con số để cắt lỗ ngay lập tức thay vì tiếp tục mơ mộng hoặc duy trì những khoản đầu tư đang trên đà sụp đổ.',
    HEALTH: 'Cần đặc biệt cẩn thận với các tai nạn bất ngờ hoặc những cơn đau cấp tính buộc bạn phải dừng mọi công việc để điều trị ngay; tinh thần có thể bị sốc nặng, hãy ưu tiên việc nghỉ ngơi và đừng chủ quan với bất kỳ dấu hiệu bất thường nào của cơ thể.',
    GROWTH: 'Bài học về sự tỉnh thức sau một biến cố lớn; bạn sẽ nhận ra những niềm tin cũ kỹ bấy lâu nay chỉ là ảo tưởng, từ đó giúp bạn phá bỏ cái tôi quá lớn để bắt đầu một hành trình mới với tư duy khiêm nhường và thực tế hơn.',
    CREATIVE: 'Đừng ngại xóa bỏ hoàn toàn một tác phẩm hay ý tưởng đã đi vào ngõ cụt để bắt đầu lại từ một tờ giấy trắng; chính sự sụp đổ của những khuôn mẫu cũ sẽ khơi nguồn cho những đột phá nghệ thuật mạnh mẽ và táo bạo nhất mà bạn từng có.',
  },
  'The Star': {
    GENERAL: 'Mọi giông bão đã đi qua, đây là thời điểm bạn tìm thấy sự bình yên và niềm tin trở lại vào cuộc sống; những hy vọng mới bắt đầu nhen nhóm và mọi việc sẽ dần chuyển biến theo hướng tích cực một cách tự nhiên.',
    LOVE: 'Những tổn thương trong quá khứ đang được chữa lành, giúp bạn mở lòng hơn để đón nhận một tình yêu chân thành và nhẹ nhàng; nếu đã có đôi, hai bạn sẽ tìm thấy tiếng nói chung và sự gắn kết sâu sắc về mặt tâm hồn.',
    CAREER: 'Bạn đang đi đúng hướng và bắt đầu nhận được những tín hiệu lạc quan cho tương lai dài hạn; đây là lúc để bạn tự tin phát huy năng lực sáng tạo và tin tưởng vào những mục tiêu lớn mà mình đang theo đuổi.',
    FINANCE: 'Tình hình tài chính đang dần ổn định trở lại sau giai đoạn khó khăn hoặc thất thoát; tuy tiền bạc không đến ngay lập tức một cách dồn dập, nhưng những kế hoạch tài chính đúng đắn sẽ bắt đầu mang lại kết quả bền vững.',
    HEALTH: 'Sức khỏe cả về thể chất lẫn tinh thần đang trong giai đoạn hồi phục rất tốt; hãy tiếp tục duy trì các thói quen lành mạnh và dành thời gian thư giãn để cơ thể được tái tạo năng lượng một cách trọn vẹn nhất.',
    GROWTH: 'Bài học lớn nhất là học cách tin tưởng vào bản thân và vũ trụ sau những vấp ngã; bạn đang tìm lại được mục đích sống thực sự và cảm thấy bình an hơn khi biết rằng mọi thứ rồi sẽ ổn thỏa theo cách của nó.',
    CREATIVE: 'Luồng cảm hứng tươi mới đang tràn về giúp bạn nảy ra những ý tưởng mang tính thẩm mỹ cao và giàu cảm xúc; hãy tận dụng giai đoạn này để sáng tạo nên những tác phẩm có khả năng truyền cảm hứng và chữa lành cho người khác.',
  },
  'The Moon': {
    GENERAL: 'Mọi thứ xung quanh bạn hiện đang rất nhập nhằng và thiếu minh bạch; đây là lúc bạn dễ bị nhầm lẫn bởi những thông tin sai lệch hoặc ảo tưởng cá nhân, vì vậy tuyệt đối không nên đưa ra các quyết định quan trọng.',
    LOVE: 'Mối quan hệ đang bao trùm bởi sự hoài nghi, hiểu lầm hoặc có những bí mật chưa được tiết lộ; bạn cần tỉnh táo để phân biệt giữa nỗi sợ hãi do mình tự tưởng tượng ra và thực tế đang diễn ra để tránh ghen tuông vô cớ.',
    CAREER: 'Môi trường làm việc đang thiếu sự công khai và có thể xuất hiện những ý đồ ngầm từ đồng nghiệp hoặc đối tác; hãy cẩn trọng với các lời hứa hẹn chưa có căn cứ và tin vào trực giác của mình để nhận diện các rủi ro tiềm ẩn.',
    FINANCE: 'Cảnh báo về các rủi ro tài chính bị che giấu hoặc những cái bẫy đầu tư nhìn có vẻ hấp dẫn nhưng thiếu thực tế; hãy kiểm tra kỹ mọi điều khoản giấy tờ và không xuống tiền khi cảm thấy thông tin còn mù mờ.',
    HEALTH: 'Chú ý đến các vấn đề về tâm lý như lo âu kéo dài, mất ngủ hoặc những thay đổi nội tiết tố khó nhận biết; đây là lúc bạn cần đi khám chuyên khoa nếu thấy cơ thể có những dấu hiệu bất thường mà không rõ nguyên nhân.',
    GROWTH: 'Bài học lớn nhất là học cách đối diện với những nỗi sợ sâu thẳm và sự bất định của cuộc sống; bạn đang rèn luyện khả năng lắng nghe trực giác để tìm ra lối đi đúng đắn ngay cả khi mọi thứ xung quanh đang tối tăm và xáo trộn.',
    CREATIVE: 'Cảm hứng bùng nổ từ thế giới của những giấc mơ và những hình ảnh siêu thực; đây là thời điểm vàng để bạn khai thác các ý tưởng mang tính huyền bí, tâm lý học hoặc những tác phẩm có chiều sâu cảm xúc mãnh liệt.',
  },
  'The Sun': {
    GENERAL: 'Mọi thứ đều trở nên sáng tỏ, thuận lợi và tràn đầy hy vọng; đây là thời điểm rực rỡ nhất để bạn gặt hái thành quả, nhận được sự công nhận và tận hưởng niềm vui trọn vẹn.',
    LOVE: 'Mối quan hệ tràn đầy sự ấm áp, chân thành và tin tưởng tuyệt đối vào nhau; những hiểu lầm cũ được xóa bỏ hoàn toàn, thay vào đó là sự gắn kết bền vững, hạnh phúc và có thể có những tin vui lớn.',
    CAREER: 'Bạn đạt được thành công vang dội và nhận được sự nể trọng xứng đáng từ đồng nghiệp lẫn cấp trên; mọi kế hoạch hay dự án bạn đang thực hiện đều diễn ra suôn sẻ và mang lại kết quả vượt mong đợi.',
    FINANCE: 'Tình hình tài chính khởi sắc mạnh mẽ, minh bạch và ổn định; bạn có thể nhận được những khoản lợi nhuận lớn, sự tăng lương hoặc những cơ hội tiền bạc rõ ràng giúp bạn hoàn toàn tự tin vào tương lai.',
    HEALTH: 'Sức khỏe đang ở trạng thái sung mãn nhất, tràn đầy năng lượng và sức sống mãnh liệt; tinh thần lạc quan và minh mẫn sẽ giúp bạn hồi phục cực kỳ nhanh chóng nếu có vấn đề thể chất trước đó.',
    GROWTH: 'Bài học lớn nhất là học cách sống trọn vẹn với niềm vui và sự tự tin vào chính mình; bạn đang chạm tới ngưỡng cửa của sự tự nhận thức, tỏa sáng một cách tự nhiên và không còn bị kìm hãm bởi những nỗi sợ cũ.',
    CREATIVE: 'Cảm hứng dồi dào giúp bạn tạo ra những tác phẩm mang năng lượng tích cực và có sức lan tỏa rộng rãi; đây là thời điểm vàng để bạn ra mắt các dự án tâm huyết vì chúng chắc chắn sẽ nhận được sự ủng hộ nhiệt liệt.',
  },
  'Judgement': {
    GENERAL: 'Đã đến lúc bạn phải đưa ra quyết định cuối cùng cho một vấn đề kéo dài; đây là sự thức tỉnh giúp bạn nhìn nhận lại toàn bộ hành trình đã qua để dứt khoát bước sang một chương mới hoàn toàn khác biệt.',
    LOVE: 'Một thời điểm "phán xét" cho mối quan hệ: hoặc là sự tha thứ để cùng nhau tái sinh, hoặc là quyết định dứt khoát chấm dứt dựa trên những gì cả hai đã trải qua; không còn chỗ cho sự trốn tránh hay mập mờ.',
    CAREER: 'Bạn sẽ nhận được kết quả xứng đáng cho những nỗ lực (hoặc sai lầm) trong quá khứ thông qua các đợt đánh giá năng lực; đây cũng là tiếng gọi thôi thúc bạn chuyển sang một công việc đúng với lý tưởng thực sự của mình.',
    FINANCE: 'Các vấn đề tiền bạc tồn đọng hoặc tranh chấp pháp lý sẽ đi đến hồi kết với một phán quyết rõ ràng; hãy kiểm tra kỹ các cam kết tài chính cũ vì chúng sẽ được đem ra xem xét lại trong thời gian này.',
    HEALTH: 'Một giai đoạn hồi phục mạnh mẽ sau thời gian dài điều trị hoặc bạn sẽ nhận được kết quả chẩn đoán chính xác giúp chấm dứt sự lo âu; cơ thể bạn đang có cơ hội để "tái sinh" và nạp lại năng lượng mới.',
    GROWTH: 'Bài học về sự tự đánh giá và tha thứ cho chính mình; bạn đang tìm thấy mục đích sống cao cả hơn và sẵn sàng rũ bỏ lớp vỏ cũ để sống một cuộc đời có ý nghĩa, trung thực với bản chất thật của bản thân.',
    CREATIVE: 'Đây là thời điểm để hoàn thiện và công bố tác phẩm sau thời gian dài ấp ủ; bạn sẽ nhận được những phản hồi công tâm, giúp bạn nhận diện rõ giá trị thực sự và hướng đi tiếp theo trong hành trình sáng tạo của mình.',
  },
  'The World': {
    GENERAL: 'Mọi kế hoạch của bạn đang đi đến hồi kết thúc viên mãn; bạn đã hoàn thành một hành trình dài và đây là lúc để tận hưởng cảm giác tự hào, trọn vẹn khi mọi thứ đều diễn ra đúng như ý nguyện.',
    LOVE: 'Mối quan hệ đạt đến sự thấu hiểu và gắn kết sâu sắc nhất; đây là thời điểm lý tưởng cho một cam kết lâu dài, một đám cưới hoặc đơn giản là sự hòa hợp tuyệt đối sau khi đã cùng nhau vượt qua mọi thử thách.',
    CAREER: 'Bạn đã chinh phục được mục tiêu lớn nhất hoặc hoàn thành xuất sắc một dự án dài hơi; đây là lúc để nhận phần thưởng xứng đáng, thăng tiến lên vị trí cao hơn hoặc có những cơ hội mở rộng sự nghiệp ra quy mô quốc tế.',
    FINANCE: 'Tình hình tài chính đạt đến ngưỡng an toàn và thịnh vượng bền vững; các khoản đầu tư đã sinh lời ổn định và bạn hoàn toàn có đủ nguồn lực để tận hưởng cuộc sống hoặc thực hiện những dự định lớn mà không cần lo lắng.',
    HEALTH: 'Cơ thể và tâm trí của bạn đang ở trạng thái cân bằng và khỏe mạnh nhất; mọi nỗ lực chăm sóc bản thân trước đây đã mang lại kết quả rõ rệt, giúp bạn có một sức sống bền bỉ và tinh thần cực kỳ lạc quan.',
    GROWTH: 'Bài học lớn nhất là sự nhận thức về vị trí của bản thân trong thế giới; bạn không còn cảm thấy lạc lõng mà đã tìm thấy sự bình an trọn vẹn, hiểu rằng mọi trải nghiệm đã qua đều là những mảnh ghép cần thiết để tạo nên phiên bản hoàn hảo của bạn hôm nay.',
    CREATIVE: 'Đây là thời điểm "vàng" để ra mắt tác phẩm tâm huyết ra công chúng; sự sáng tạo của bạn đã đạt đến độ chín muồi, mang lại sự công nhận rộng rãi và giúp bạn hoàn tất một chương lớn đầy tự hào trong hành trình nghệ thuật của mình.',
  },
  'Ace of Wands': {
    GENERAL: 'Một khởi đầu mới đầy nhiệt huyết và năng lượng đang mở ra; đây là thời điểm vàng để bạn bắt tay vào thực hiện ngay một ý tưởng hoặc kế hoạch mà bạn hằng ấp ủ bấy lâu nay.',
    LOVE: 'Một sự thu hút mãnh liệt hoặc một mối quan hệ mới đầy đam mê sắp bắt đầu; nếu đã có đôi, hai bạn sẽ tìm lại được ngọn lửa lãng mạn và sự hứng khởi như lúc mới yêu.',
    CAREER: 'Một cơ hội việc làm, một dự án mới hoặc một ý tưởng kinh doanh đột phá đang chờ bạn; hãy chủ động nắm bắt ngay vì nguồn năng lượng sáng tạo của bạn đang ở mức cao nhất để thành công.',
    FINANCE: 'Xuất hiện một nguồn thu nhập mới hoặc một cơ hội đầu tư đầy tiềm năng; tuy nhiên, bạn cần hành động quyết đoán và thực tế để biến ý tưởng này thành lợi nhuận thật sự thay vì chỉ nằm trên kế hoạch.',
    HEALTH: 'Sức sống đang trào dâng mạnh mẽ, giúp bạn hồi phục nhanh chóng và có thêm động lực để bắt đầu một chế độ tập luyện mới đầy năng suất; hãy tận dụng nguồn năng lượng này để cải thiện thể chất.',
    GROWTH: 'Bài học lớn nhất là học cách khơi dậy đam mê và lòng can đảm bên trong; bạn đang nhận ra sức mạnh cá nhân và sẵn sàng hành động để thay đổi cuộc sống mình một cách quyết liệt và tự tin.',
    CREATIVE: 'Một khoảnh khắc "Aha!" mang đến nguồn cảm hứng bất tận cho bạn; đây là lúc lý tưởng nhất để bạn đặt bút viết những dòng đầu tiên hoặc bắt đầu một dự án nghệ thuật mới đầy táo bạo và khác biệt.',
  },
  'Two of Wands': {
    GENERAL: 'Bạn đang đứng trước một lựa chọn quan trọng và cần phải lên kế hoạch dài hạn; đây là lúc để mở rộng tầm nhìn ra xa hơn thay vì chỉ quẩn quanh trong vùng an toàn hiện tại.',
    LOVE: 'Mối quan hệ đang ở giai đoạn cần sự thống nhất về mục tiêu tương lai; bạn và đối phương nên cùng nhau bàn bạc về những dự định chung hoặc cân nhắc việc tiến xa hơn một bước để gắn kết.',
    CAREER: 'Bạn đang xem xét các hướng đi mới hoặc khả năng hợp tác mở rộng; đây là thời điểm tốt để lập chiến lược, phân tích rủi ro và chuẩn bị nguồn lực trước khi thực sự bắt tay vào hành động.',
    FINANCE: 'Tình hình tài chính ổn định nhưng bạn đang cân nhắc việc đầu tư vào các dự án mang tính dài hơi; hãy tính toán kỹ lưỡng các phương án dự phòng để đảm bảo sự tăng trưởng bền vững cho túi tiền.',
    HEALTH: 'Sức khỏe hiện tại khá ổn, tuy nhiên bạn cần chú ý đến việc cân bằng giữa áp lực công việc và thời gian nghỉ ngơi để tránh căng thẳng do mải mê tính toán các kế hoạch quá độ.',
    GROWTH: 'Bài học lớn nhất là sự can đảm để bước ra khỏi vùng an toàn; bạn đang học cách tin tưởng vào tầm nhìn của chính mình và chuẩn bị tâm thế sẵn sàng cho những thử thách lớn lao hơn phía trước.',
    CREATIVE: 'Bạn đang nung nấu những ý tưởng lớn mang tính quy mô; đây là lúc để phác thảo sơ đồ, xây dựng khung sườn vững chắc cho tác phẩm hoặc dự án nghệ thuật trước khi bắt tay vào triển khai chi tiết.',
  },
  'Three of Wands': {
    GENERAL: 'Những nỗ lực và kế hoạch trước đó của bạn bắt đầu có kết quả bước đầu; đây là lúc bạn có thể tự tin quan sát sự phát triển và mở rộng quy mô của các vấn đề trong cuộc sống.',
    LOVE: 'Mối quan hệ đang tiến triển thuận lợi với những dự định chung dài hạn; nếu đang xa cách, đây là dấu hiệu cho thấy sự hội ngộ hoặc những bước tiến mới giúp cả hai gắn kết hơn qua những trải nghiệm thực tế.',
    CAREER: 'Các cơ hội hợp tác và mở rộng thị trường đang mở ra rõ rệt; công việc kinh doanh hoặc dự án của bạn bắt đầu vươn xa hơn, đòi hỏi bạn phải có tầm nhìn chiến lược để quản lý sự tăng trưởng này.',
    FINANCE: 'Lợi nhuận từ các khoản đầu tư trước đây bắt đầu đổ về túi; đây là thời điểm tốt để cân nhắc việc tái đầu tư hoặc mở rộng các nguồn thu nhập mới dựa trên nền tảng ổn định hiện có.',
    HEALTH: 'Tình trạng thể chất và tinh thần đang rất ổn định, cho phép bạn duy trì nhịp độ làm việc cao; hãy tiếp tục duy trì các thói quen tốt và đừng quên dành thời gian thư giãn để quan sát thành quả của mình.',
    GROWTH: 'Bài học lớn nhất là sự kiên nhẫn và niềm tin vào tầm nhìn xa; bạn đang học cách chờ đợi thành quả một cách chủ động và tự tin khẳng định vị thế của mình trong mọi quyết định.',
    CREATIVE: 'Tác phẩm của bạn bắt đầu nhận được sự chú ý từ công chúng hoặc các đối tác tiềm năng; đây là lúc để bạn đẩy mạnh việc quảng bá và đưa những ý tưởng sáng tạo của mình vươn ra những môi trường rộng lớn hơn.',
  },
  'Four of Wands': {
    GENERAL: 'Thời điểm của sự ổn định, bình yên và những dịp ăn mừng; bạn đã hoàn thành một cột mốc quan trọng và giờ là lúc để tận hưởng thành quả cùng những người thân thiết xung quanh.',
    LOVE: 'Mối quan hệ bước vào giai đoạn cam kết bền vững và hạnh phúc; đây là lúc lý tưởng để bàn chuyện cưới hỏi, dọn về chung nhà hoặc đơn giản là cùng nhau tận hưởng không gian sống ấm cúng, hòa hợp.',
    CAREER: 'Một dự án hoặc giai đoạn công việc đã kết thúc tốt đẹp, mang lại sự công nhận và môi trường làm việc cực kỳ hòa hợp; đây là lúc để thắt chặt tình đồng đội và ăn mừng những bước tiến chung.',
    FINANCE: 'Tài chính ổn định và vững chắc, cho phép bạn thoải mái chi tiêu cho gia đình, nhà cửa hoặc những buổi tiệc tùng vui vẻ; bạn đang gặt hái được sự an tâm về tiền bạc sau một thời gian dài nỗ lực.',
    HEALTH: 'Thể trạng và tinh thần đều ở mức rất tốt, tràn đầy sức sống; hãy duy trì trạng thái này bằng cách chia sẻ niềm vui với mọi người và giữ cho không gian sống luôn gọn gàng, thoải mái.',
    GROWTH: 'Bài học lớn nhất là sự biết ơn và cảm giác thuộc về một cộng đồng; bạn đang tìm thấy sự bình an nội tại thông qua việc kết nối với nguồn cội và xây dựng những giá trị nền móng bền vững.',
    CREATIVE: 'Đây là giai đoạn thăng hoa của sự cộng tác; những ý tưởng chung được hiện thực hóa một cách hài hòa, mang lại kết quả đẹp mắt và nhận được sự ủng hộ nhiệt tình từ những người xung quanh.',
  },
  'Six of Wands': {
    GENERAL: 'Đây là thời điểm của sự khải hoàn; bạn đã vượt qua được những thử thách trước đó và giờ là lúc để tận hưởng sự công nhận xứng đáng từ mọi người xung quanh cho những nỗ lực của mình.',
    LOVE: 'Mối quan hệ của bạn đang nhận được sự ủng hộ nhiệt tình từ gia đình và bạn bè; đây là lúc cả hai cảm thấy tự hào về nhau và cùng chia sẻ niềm kiêu hãnh về những gì đã cùng nhau xây dựng.',
    CAREER: 'Bạn đang gặt hái thành công vang dội trong công việc; một sự thăng tiến, một dự án thắng lợi hoặc đơn giản là sự tán thưởng từ cấp trên sẽ khẳng định vị thế và năng lực dẫn dắt của bạn.',
    FINANCE: 'Những nỗ lực tài chính trước đây đã mang lại kết quả rực rỡ; bạn có thể nhận được tiền thưởng, lợi nhuận cao hoặc những cơ hội làm ăn mới nhờ vào uy tín cá nhân đang ở mức cao nhất.',
    HEALTH: 'Năng lượng và sức khỏe đang ở trạng thái đỉnh cao; nếu bạn vừa trải qua giai đoạn điều trị hoặc rèn luyện, đây là lúc bạn thấy rõ sự hồi phục ngoạn mục và sự dẻo dai của cơ thể mình.',
    GROWTH: 'Bài học lớn nhất là sự tự tin vào năng lực bản thân; bạn đang nhận ra giá trị thực sự của mình và học cách chấp nhận những lời khen ngợi một cách xứng đáng thay vì khiêm tốn thái quá.',
    CREATIVE: 'Tác phẩm của bạn đang nhận được sự chú ý lớn và những phản hồi tích cực từ công chúng; đây là thời điểm tuyệt vời để công bố dự án vì sức hút và tầm ảnh hưởng của bạn đang cực kỳ mạnh mẽ.',
  },
  'Seven of Wands': {
    GENERAL: 'Bạn đang ở thế thượng phong nhưng phải đối mặt với nhiều áp lực hoặc sự phản đối từ xung quanh; đây là lúc cần sự quyết liệt và kiên định tuyệt đối để bảo vệ quan điểm và vị thế của mình.',
    LOVE: 'Mối quan hệ đang gặp phải sự can thiệp từ bên ngoài hoặc những lời bàn tán không hay; bạn và đối phương cần sát cánh bên nhau, thiết lập ranh giới rõ ràng để bảo vệ tình cảm trước những tác động tiêu cực đó.',
    CAREER: 'Áp lực cạnh tranh đang lên cao, có nhiều người muốn thay thế hoặc gây khó dễ cho vị trí của bạn; hãy giữ vững lập trường, làm việc quyết liệt để chứng minh năng lực và bảo vệ những thành quả mà bạn đã vất vả đạt được.',
    FINANCE: 'Bạn cần có thái độ cứng rắn để bảo vệ tài sản và các khoản đầu tư trước những rủi ro bất ngờ hoặc những lời đề nghị vay mượn không hợp lý; hãy học cách từ chối để giữ vững nền tảng tài chính của mình.',
    HEALTH: 'Cơ thể đang trong trạng thái "gồng gánh" để chống lại sự mệt mỏi hoặc mầm bệnh; hãy chú trọng tăng cường sức đề kháng, nghỉ ngơi hợp lý và đừng chủ quan trước những dấu hiệu cho thấy bạn đang bị quá tải.',
    GROWTH: 'Bài học lớn nhất là sự dũng cảm bảo vệ niềm tin cá nhân; bạn đang học cách đối diện với dư luận, vượt qua nỗi sợ bị chỉ trích để không lùi bước trước những giá trị cốt lõi mà mình đang theo đuổi.',
    CREATIVE: 'Đừng để những ý kiến trái chiều hay sự phê bình làm bạn nản lòng; hãy kiên trì bảo vệ ý tưởng độc bản của mình đến cùng, vì chính sự khác biệt và góc nhìn riêng biệt mới tạo nên giá trị thực sự cho tác phẩm.',
  },
  'Eight of Wands': {
    GENERAL: 'Mọi thứ đang lao đi với tốc độ chóng mặt; những trì trệ trước đây biến mất hoàn toàn, thay vào đó là những tin tức dồn dập và những sự kiện xảy ra liên tiếp khiến bạn phải hành động ngay lập tức để không bỏ lỡ nhịp.',
    LOVE: 'Tình cảm tiến triển cực kỳ nhanh chóng, có thể là một cuộc tình "sét đánh" hoặc những nút thắt trong mối quan hệ bấy lâu nay đột ngột được tháo gỡ thông qua những lời bày tỏ hoặc tin nhắn thẳng thắn, dứt khoát.',
    CAREER: 'Công việc bước vào giai đoạn cao điểm với hàng loạt email, cuộc họp và nhiệm vụ diễn ra cùng lúc; đây là thời điểm để bạn tăng tốc hoàn thành các mục tiêu dang dở và sẵn sàng cho những cơ hội hoặc chuyến công tác bất ngờ.',
    FINANCE: 'Các giao dịch tài chính diễn ra nhanh chóng, dòng tiền luân chuyển mạnh hoặc các khoản lợi nhuận đang trên đường đổ về túi; hãy quyết định dứt khoát khi thấy cơ hội nhưng cần kiểm tra kỹ thông tin để tránh sai sót do vội vàng.',
    HEALTH: 'Sức khỏe hồi phục rất nhanh nếu bạn đang gặp vấn đề thể chất; tuy nhiên, nhịp sống quá nhanh dễ khiến bạn gặp áp lực tinh thần hoặc căng thẳng thần kinh, hãy chú ý điều tiết hơi thở và nghỉ ngơi xen kẽ để không bị kiệt sức.',
    GROWTH: 'Bài học về việc nắm bắt thời cơ và sự linh hoạt; bạn đang học cách thích nghi với sự thay đổi nhanh chóng, rèn luyện tư duy nhạy bén để đưa ra những quyết định đúng đắn và chính xác trong thời gian ngắn nhất.',
    CREATIVE: 'Cảm hứng tuôn trào giúp bạn hoàn thiện các dự án nghệ thuật với tốc độ kỷ lục; đây là giai đoạn "vào guồng" cực tốt, hãy tận dụng tối đa sự tập trung này để hiện thực hóa ý tưởng và ra mắt tác phẩm ngay khi còn nóng hổi.',
  },
  'Nine of Wands': {
    GENERAL: 'Bạn đang ở rất gần đích đến sau một hành trình dài đầy mệt mỏi; dù cảm thấy kiệt sức, đây là lúc bạn cần huy động những nguồn lực cuối cùng để bảo vệ thành quả và không được phép bỏ cuộc ngay lúc này.',
    LOVE: 'Mối quan hệ đang trải qua giai đoạn thử thách khiến bạn có tâm lý phòng thủ hoặc đa nghi do những tổn thương cũ; hãy kiên trì và tỉnh táo để phân biệt giữa nỗi sợ hãi cá nhân và thực tế để tránh tạo ra khoảng cách vô hình.',
    CAREER: 'Công việc đang ở giai đoạn nước rút với áp lực cực lớn; bạn cần giữ vững vị thế, kiên cường đối mặt với những trở ngại cuối cùng và cảnh giác với những biến cố bất ngờ có thể xảy ra trước khi dự án hoàn tất.',
    FINANCE: 'Hãy thắt chặt quản lý tài chính và bảo vệ số vốn hiện có một cách nghiêm ngặt; đây không phải lúc để mạo hiểm mà là lúc để rà soát lại các kẽ hở, đảm bảo an toàn cho túi tiền trước khi bước sang giai đoạn mới.',
    HEALTH: 'Sức bền của bạn đang bị bào mòn rõ rệt, dễ cảm thấy uể oải hoặc tái phát những vấn đề sức khỏe cũ; hãy chú trọng việc nghỉ ngơi hồi phục xen kẽ để duy trì năng lượng cho chặng đường cuối, tránh để bản thân gục ngã vì quá tải.',
    GROWTH: 'Bài học về sự kiên cường và bản lĩnh đứng vững sau những vấp ngã; bạn đang học cách biến những "vết sẹo" kinh nghiệm thành sức mạnh nội tại, giúp bạn trở nên vững vàng và khó bị khuất phục hơn trước bất kỳ khó khăn nào.',
    CREATIVE: 'Dự án sáng tạo của bạn đang ở bước hoàn thiện cuối cùng đầy gian nan; hãy kiên trì trau chuốt lại những chi tiết nhỏ nhất và giữ vững niềm tin vào ý tưởng của mình, đừng để sự mệt mỏi làm bạn tặc lưỡi bỏ qua chất lượng tác phẩm.',
  },
};

async function run() {
  await client.connect();

  for (const [cardName, meanings] of Object.entries(cardMeanings)) {
    const r = await client.query('SELECT card_id FROM "Card" WHERE name = $1', [cardName]);
    if (r.rows.length === 0) { console.error('❌ Card not found: ' + cardName); continue; }
    const cardId = r.rows[0].card_id;

    for (const [category, content] of Object.entries(meanings)) {
      await client.query(
        'INSERT INTO "CardMeaning" (card_id, category, content) VALUES ($1, $2, $3)',
        [cardId, category, content]
      );
    }
    console.log('✅ ' + cardName + ' (card_id=' + cardId + '): 7 meanings inserted');
  }

  const res = await client.query('SELECT COUNT(*) FROM "CardMeaning"');
  console.log('\n📖 Total meanings in DB: ' + res.rows[0].count);
  await client.end();
}

run().catch(e => { console.error(e); process.exit(1); });
